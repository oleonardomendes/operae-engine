import fs from 'fs'
import path from 'path'

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface StoreConfig {
  store_id: string
  nome: string
  dominio: string
  regime: 'MEI' | 'SN' | 'LP'

  tema: {
    cor_primaria: string
    cor_secundaria: string
    logo_url: string
    favicon_url: string
  }

  bling: {
    client_id: string
    client_secret: string
    access_token?: string   // legado — migrar para store_integrations
    refresh_token?: string  // legado — migrar para store_integrations
  }

  mercado_pago: {
    access_token?: string   // legado — migrar para store_integrations
    public_key: string
    webhook_secret: string
  }

  melhor_envio: {
    token?: string     // legado — migrar para store_integrations
    sandbox: boolean
    from_nome?: string
    from_cep?: string
    from_rua?: string
    from_numero?: string
    from_bairro?: string
    from_cidade?: string
    from_uf?: string
  }

  resend: {
    api_key: string
    from: string
  }

  precificacao: {
    margem_ml: number
    margem_shopee: number
    margem_site: number
    desconto_pix: number
    taxa_ml: number
    taxa_shopee: number
  }

  analytics: {
    gtm_id: string
    meta_pixel_id: string
    ga4_id: string
    tiktok_pixel_id: string
    google_ads_id: string
  }

  supabase: {
    url: string
    anon_key: string
  }

  contato?: {
    email?: string
    whatsapp?: string
    instagram_url?: string
    facebook_url?: string
  }
}

// ─── Resolver env vars ────────────────────────────────────────────────────────

function resolveValue(value: unknown): unknown {
  if (typeof value === 'string' && value.startsWith('env:')) {
    const key = value.slice(4)
    const resolved = process.env[key]
    if (!resolved) {
      throw new Error(
        `[store-config] Variável de ambiente "${key}" não está definida. ` +
        `Adicione-a ao .env.local da loja.`
      )
    }
    return resolved
  }

  if (typeof value === 'object' && value !== null) {
    if (Array.isArray(value)) return value.map(resolveValue)
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, resolveValue(v)])
    )
  }

  return value
}

// ─── Loader ───────────────────────────────────────────────────────────────────

const cache = new Map<string, StoreConfig>()

export function loadStoreConfig(storeId?: string): StoreConfig {
  const id = storeId ?? process.env.STORE_ID

  if (!id) {
    throw new Error(
      '[store-config] STORE_ID não definido. ' +
      'Defina a variável de ambiente STORE_ID ou passe o storeId como parâmetro.'
    )
  }

  if (cache.has(id)) return cache.get(id)!

  const filePath = path.join(process.cwd(), 'store-configs', id, 'store-config.json')

  if (!fs.existsSync(filePath)) {
    throw new Error(
      `[store-config] Arquivo não encontrado: ${filePath}\n` +
      `Certifique-se de que a pasta store-configs/${id}/ existe e contém store-config.json`
    )
  }

  let raw: unknown
  try {
    raw = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch (err) {
    throw new Error(`[store-config] Erro ao parsear ${filePath}: ${err}`)
  }

  const resolved = resolveValue(raw) as StoreConfig
  cache.set(id, resolved)

  return resolved
}

// ─── Helper para rotas de API (lê store_id do header ou body) ─────────────────

export function loadStoreConfigFromRequest(storeId: string): StoreConfig {
  return loadStoreConfig(storeId)
}

// ─── Limpa cache (útil em testes) ─────────────────────────────────────────────

export function clearStoreConfigCache(): void {
  cache.clear()
}
