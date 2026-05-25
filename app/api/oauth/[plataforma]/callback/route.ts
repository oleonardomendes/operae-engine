import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'
import { saveIntegrationToken, type Plataforma } from '@/lib/integrations'

// ─── Tipos ────────────────────────────────────────────────────────────────────

type PlataformaUrl = 'bling' | 'mercado-pago' | 'melhor-envio'

interface OAuthStatePayload {
  storeId: string
  plataforma: PlataformaUrl
  timestamp: number
  nonce: string
}

interface BlingTokenResponse extends Record<string, unknown> {
  access_token: string
  refresh_token: string
  expires_in: number
  scope?: string
}

interface MpTokenResponse extends Record<string, unknown> {
  access_token: string
  refresh_token?: string
  expires_in?: number
  scope?: string
}

interface MeTokenResponse extends Record<string, unknown> {
  access_token: string
  refresh_token?: string
  expires_in?: number
  scope?: string
}

type RawTokenResponse = BlingTokenResponse | MpTokenResponse | MeTokenResponse

// ─── Config por plataforma ────────────────────────────────────────────────────

const TOKEN_URLS: Record<PlataformaUrl, string> = {
  'bling': 'https://www.bling.com.br/Api/v3/oauth/token',
  'mercado-pago': 'https://api.mercadopago.com/oauth/token',
  'melhor-envio': 'https://melhorenvio.com.br/oauth/token',
}

const DB_PLATFORM_MAP: Record<PlataformaUrl, Plataforma> = {
  'bling': 'bling',
  'mercado-pago': 'mercado_pago',
  'melhor-envio': 'melhor_envio',
}

const CREDENTIALS: Record<PlataformaUrl, { id: string | undefined; secret: string | undefined }> = {
  'bling': { id: process.env.BLING_CLIENT_ID, secret: process.env.BLING_CLIENT_SECRET },
  'mercado-pago': { id: process.env.MP_CLIENT_ID, secret: process.env.MP_CLIENT_SECRET },
  'melhor-envio': { id: process.env.ME_CLIENT_ID, secret: process.env.ME_CLIENT_SECRET },
}

const SUPPORTED_PLATFORMS = new Set<string>(['bling', 'mercado-pago', 'melhor-envio'])

// ─── Helpers ──────────────────────────────────────────────────────────────────

function decodeState(state: string): OAuthStatePayload {
  const base64 = state.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=')
  return JSON.parse(atob(padded)) as OAuthStatePayload
}

async function logOperation(
  storeId: string,
  tipo: string,
  status: 'success' | 'error',
  detalhes: Record<string, unknown>
): Promise<void> {
  try {
    const supabase = createServiceClient()
    await supabase.from('operation_logs').insert({
      store_id: storeId,
      tipo,
      status,
      detalhes,
      created_at: new Date().toISOString(),
    })
  } catch (err) {
    console.error('[oauth/callback] Falha ao registrar log de operação:', err)
  }
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  { params }: { params: { plataforma: string } }
) {
  const plataforma = params.plataforma
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const painelUrl = `${appUrl}/painel/integracoes`

  if (!SUPPORTED_PLATFORMS.has(plataforma)) {
    return NextResponse.redirect(`${painelUrl}?erro=plataforma_invalida`)
  }

  const code = req.nextUrl.searchParams.get('code')
  const stateParam = req.nextUrl.searchParams.get('state')
  const stateCookie = req.cookies.get('oauth_state')?.value

  if (!code || !stateParam) {
    return NextResponse.redirect(`${painelUrl}?erro=${plataforma}&motivo=codigo_ausente`)
  }

  if (!stateCookie || stateParam !== stateCookie) {
    return NextResponse.redirect(`${painelUrl}?erro=${plataforma}&motivo=state_invalido`)
  }

  let statePayload: OAuthStatePayload
  try {
    statePayload = decodeState(stateParam)
  } catch {
    return NextResponse.redirect(`${painelUrl}?erro=${plataforma}&motivo=state_corrompido`)
  }

  if (Date.now() - statePayload.timestamp > 10 * 60 * 1000) {
    return NextResponse.redirect(`${painelUrl}?erro=${plataforma}&motivo=state_expirado`)
  }

  const { storeId } = statePayload
  const dbPlatform = DB_PLATFORM_MAP[plataforma as PlataformaUrl]
  const creds = CREDENTIALS[plataforma as PlataformaUrl]

  if (!creds.id || !creds.secret) {
    await logOperation(storeId, 'oauth_connect', 'error', {
      plataforma: dbPlatform,
      motivo: 'credenciais_ausentes',
    })
    return NextResponse.redirect(`${painelUrl}?erro=${plataforma}&motivo=credenciais_ausentes`)
  }

  const callbackUrl = `${appUrl}/api/oauth/${plataforma}/callback`
  const tokenUrl = TOKEN_URLS[plataforma as PlataformaUrl]

  let rawToken: RawTokenResponse
  try {
    const res = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
        Authorization: `Basic ${btoa(`${creds.id}:${creds.secret}`)}`,
        'User-Agent': 'OperaeEngine (suporte@operae.com.br)',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: callbackUrl,
        client_id: creds.id,
        client_secret: creds.secret,
      }).toString(),
    })

    if (!res.ok) {
      const detail = await res.text()
      throw new Error(`Troca de token falhou (${res.status}): ${detail}`)
    }

    rawToken = await res.json() as RawTokenResponse
  } catch (err) {
    const motivo = err instanceof Error ? err.message : 'troca_token_falhou'
    await logOperation(storeId, 'oauth_connect', 'error', { plataforma: dbPlatform, motivo })
    return NextResponse.redirect(
      `${painelUrl}?erro=${plataforma}&motivo=${encodeURIComponent(motivo)}`
    )
  }

  try {
    await saveIntegrationToken(storeId, dbPlatform, {
      access_token: rawToken.access_token,
      refresh_token: rawToken.refresh_token,
      expires_in: rawToken.expires_in,
      scope: rawToken.scope,
      raw_response: rawToken,
    })
  } catch (err) {
    const motivo = err instanceof Error ? err.message : 'salvar_token_falhou'
    await logOperation(storeId, 'oauth_connect', 'error', { plataforma: dbPlatform, motivo })
    return NextResponse.redirect(
      `${painelUrl}?erro=${plataforma}&motivo=${encodeURIComponent(motivo)}`
    )
  }

  await logOperation(storeId, 'oauth_connect', 'success', { plataforma: dbPlatform })

  const response = NextResponse.redirect(`${painelUrl}?sucesso=${plataforma}`)
  response.cookies.delete('oauth_state')
  return response
}
