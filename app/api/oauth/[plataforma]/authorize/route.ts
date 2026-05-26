import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'

// ─── Tipos ────────────────────────────────────────────────────────────────────

type PlataformaUrl = 'bling' | 'mercado-pago' | 'melhor-envio'

interface AuthUrlParams {
  clientId: string
  state: string
  callbackUrl: string
}

// ─── Config por plataforma ────────────────────────────────────────────────────

const PLATFORM_AUTH_URLS: Record<PlataformaUrl, (p: AuthUrlParams) => string> = {
  'bling': ({ clientId, state }) =>
    `https://www.bling.com.br/OAuth/Authorize` +
    `?response_type=code&client_id=${clientId}&state=${state}`,

  'mercado-pago': ({ clientId, state, callbackUrl }) =>
    `https://auth.mercadopago.com.br/authorization` +
    `?client_id=${clientId}&response_type=code&platform_id=mp` +
    `&state=${state}&redirect_uri=${encodeURIComponent(callbackUrl)}`,

  'melhor-envio': ({ clientId, state, callbackUrl }) =>
    `https://melhorenvio.com.br/oauth/authorize` +
    `?client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(callbackUrl)}` +
    `&response_type=code` +
    `&scope=cart-read+cart-write+companies-read+coupons-read+notifications-read` +
    `+orders-read+products-read+products-write+purchases-read` +
    `+shipping-calculate+shipping-cancel+shipping-checkout+shipping-companies` +
    `+shipping-generate+shipping-preview+shipping-print+shipping-share` +
    `+shipping-tracking+ecommerce-shipping+transactions-read+users-read+webhooks-read` +
    `&state=${state}`,
}

const PLATFORM_CLIENT_IDS: Record<PlataformaUrl, string | undefined> = {
  'bling': process.env.BLING_CLIENT_ID,
  'mercado-pago': process.env.MP_CLIENT_ID,
  'melhor-envio': process.env.ME_CLIENT_ID,
}

const SUPPORTED_PLATFORMS = new Set<string>(['bling', 'mercado-pago', 'melhor-envio'])

// ─── Handler ──────────────────────────────────────────────────────────────────

export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ plataforma: string }> }
) {
  const { plataforma } = await params

  if (!SUPPORTED_PLATFORMS.has(plataforma)) {
    return NextResponse.json(
      { error: `Plataforma '${plataforma}' não suportada` },
      { status: 400 }
    )
  }

  const storeId = req.nextUrl.searchParams.get('store_id')
  if (!storeId) {
    return NextResponse.json({ error: 'Parâmetro store_id obrigatório' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { data: store, error: storeError } = await supabase
    .from('stores')
    .select('store_id')
    .eq('store_id', storeId)
    .single()

  if (storeError || !store) {
    return NextResponse.json(
      { error: `[oauth/authorize] Loja '${storeId}' não encontrada` },
      { status: 404 }
    )
  }

  const clientId = PLATFORM_CLIENT_IDS[plataforma as PlataformaUrl]
  if (!clientId) {
    return NextResponse.json(
      { error: `[oauth/authorize] CLIENT_ID não configurado para '${plataforma}'` },
      { status: 500 }
    )
  }

  const nonce = crypto.randomUUID()
  const stateJson = JSON.stringify({
    storeId,
    plataforma,
    timestamp: Date.now(),
    nonce,
  })
  const state = btoa(stateJson)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const callbackUrl = `${appUrl}/api/oauth/${plataforma}/callback`

  const authUrl = PLATFORM_AUTH_URLS[plataforma as PlataformaUrl]({
    clientId,
    state,
    callbackUrl,
  })

  const response = NextResponse.redirect(authUrl)
  response.cookies.set('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600,
    path: '/',
  })

  return response
}
