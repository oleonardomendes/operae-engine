import { supabase } from './supabase'
import { getIntegrationToken } from './integrations'

const BLING_BASE = 'https://api.bling.com.br/Api/v3'

// LEGADO: usado pelo callback /api/bling/callback (rota legada)
// Substituído por saveIntegrationToken() de lib/integrations no fluxo novo
export async function saveTokensToSupabase(
  access_token: string,
  refresh_token: string
): Promise<void> {
  const { error } = await supabase.from('bling_tokens').upsert({
    id: 1,
    access_token,
    refresh_token,
    updated_at: new Date().toISOString(),
  })
  if (error) {
    console.error('[bling] Supabase saveTokens erro:', error.message)
  } else {
    console.log('[bling] tokens salvos no Supabase com sucesso')
  }
}

const getValidToken = async (storeId: string): Promise<string> => {
  return getIntegrationToken(storeId, 'bling')
}

export async function blingFetch(
  storeId: string,
  endpoint: string,
  options?: RequestInit
): Promise<any> {
  const token = await getValidToken(storeId)

  const makeRequest = (accessToken: string) =>
    fetch(`${BLING_BASE}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
        ...(options?.headers ?? {}),
      },
      signal: AbortSignal.timeout(10000),
    })

  let res = await makeRequest(token)

  if (res.status === 401) {
    const newToken = await getValidToken(storeId)
    res = await makeRequest(newToken)
  }

  if (!res.ok) {
    const detail = await res.text()
    throw new Error(`Bling API error (${res.status}): ${detail}`)
  }

  const text = await res.text()
  if (!text || text.trim() === '') {
    return { ok: true }
  }
  try {
    return JSON.parse(text)
  } catch {
    return { ok: true, raw: text }
  }
}
