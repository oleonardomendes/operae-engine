import { createServiceClient } from '@/lib/supabase-server'
import { loadStoreConfig } from '@/lib/store-config'

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type Plataforma = 'bling' | 'mercado_pago' | 'melhor_envio'

export interface TokenData {
  access_token: string
  refresh_token?: string
  expires_in?: number
  scope?: string
  raw_response?: Record<string, unknown>
}

export interface IntegrationSummary {
  plataforma: Plataforma
  expires_at: string | null
  scope: string | null
  created_at: string
}

interface IntegrationRow {
  store_id: string
  plataforma: Plataforma
  access_token: string
  refresh_token: string | null
  expires_at: string | null
  scope: string | null
  created_at: string
}

// ─── Funções públicas ─────────────────────────────────────────────────────────

export async function getIntegrationToken(
  storeId: string,
  plataforma: Plataforma
): Promise<string> {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('store_integrations')
    .select('access_token, expires_at')
    .eq('store_id', storeId)
    .eq('plataforma', plataforma)
    .single()

  if (error || !data) {
    throw new Error(
      `[integrations] Loja '${storeId}' não tem integração com '${plataforma}'. ` +
      `Configure em /painel/integracoes`
    )
  }

  if (isExpiringSoon(data.expires_at)) {
    await refreshIntegrationToken(storeId, plataforma)
    return getIntegrationToken(storeId, plataforma)
  }

  return data.access_token
}

export async function saveIntegrationToken(
  storeId: string,
  plataforma: Plataforma,
  tokenData: TokenData
): Promise<void> {
  const supabase = createServiceClient()

  const expiresAt = tokenData.expires_in
    ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
    : null

  const { error } = await supabase.from('store_integrations').upsert(
    {
      store_id: storeId,
      plataforma,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token ?? null,
      expires_at: expiresAt,
      scope: tokenData.scope ?? null,
      raw_response: tokenData.raw_response ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'store_id,plataforma' }
  )

  if (error) {
    throw new Error(
      `[integrations] Falha ao salvar token de '${plataforma}' para loja '${storeId}': ${error.message}`
    )
  }
}

export async function revokeIntegration(
  storeId: string,
  plataforma: Plataforma
): Promise<void> {
  const supabase = createServiceClient()

  const { error } = await supabase
    .from('store_integrations')
    .delete()
    .eq('store_id', storeId)
    .eq('plataforma', plataforma)

  if (error) {
    throw new Error(
      `[integrations] Falha ao revogar integração '${plataforma}' da loja '${storeId}': ${error.message}`
    )
  }

  try {
    await supabase.from('operation_logs').insert({
      store_id: storeId,
      tipo: 'oauth_revoke',
      status: 'success',
      detalhes: { plataforma },
      created_at: new Date().toISOString(),
    })
  } catch (err) {
    console.error('[integrations] Falha ao registrar log de revogação:', err)
  }
}

export async function listIntegrations(storeId: string): Promise<IntegrationSummary[]> {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('store_integrations')
    .select('plataforma, expires_at, scope, created_at')
    .eq('store_id', storeId)

  if (error) {
    throw new Error(
      `[integrations] Falha ao listar integrações da loja '${storeId}': ${error.message}`
    )
  }

  return (data ?? []) as IntegrationSummary[]
}

export async function refreshIntegrationToken(
  storeId: string,
  plataforma: Plataforma
): Promise<void> {
  if (plataforma !== 'bling') {
    throw new Error(
      `[integrations] Refresh automático não implementado para '${plataforma}'. ` +
      `Reautorize manualmente em /painel/integracoes`
    )
  }

  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('store_integrations')
    .select('refresh_token')
    .eq('store_id', storeId)
    .eq('plataforma', 'bling')
    .single()

  if (error || !data?.refresh_token) {
    throw new Error(
      `[integrations] Refresh token do Bling não encontrado para loja '${storeId}'`
    )
  }

  const config = loadStoreConfig(storeId)

  const res = await fetch('https://www.bling.com.br/Api/v3/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${btoa(`${config.bling.client_id}:${config.bling.client_secret}`)}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: data.refresh_token,
    }).toString(),
  })

  if (!res.ok) {
    const detail = await res.text()
    throw new Error(
      `[integrations] Bling refresh falhou (${res.status}): ${detail}. ` +
      `Reautorize em /painel/integracoes`
    )
  }

  const tokens = await res.json() as {
    access_token: string
    refresh_token: string
    expires_in: number
  }

  await saveIntegrationToken(storeId, 'bling', {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_in: tokens.expires_in,
  })
}

// ─── Helpers privados ─────────────────────────────────────────────────────────

function isExpiringSoon(expiresAt: string | null): boolean {
  if (!expiresAt) return false
  const fiveMinutesFromNow = Date.now() + 5 * 60 * 1000
  return new Date(expiresAt).getTime() < fiveMinutesFromNow
}
