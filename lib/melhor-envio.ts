import { getIntegrationToken } from './integrations'
import { loadStoreConfig } from './store-config'
import { createServiceClient } from './supabase-server'

const ME_BASE_URL = process.env.NODE_ENV === 'development' && process.env.ME_SANDBOX_URL
  ? process.env.ME_SANDBOX_URL
  : 'https://melhorenvio.com.br/api/v2'

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface ShippingOrigin {
  nome: string
  phone?: string
  cep: string
  rua: string
  numero: string
  bairro: string
  cidade: string
  uf: string
}

// ─── Helpers internos ─────────────────────────────────────────────────────────

async function getMEToken(storeId: string): Promise<string> {
  try {
    return await getIntegrationToken(storeId, 'melhor_envio')
  } catch (err) {
    throw new Error(
      `[melhor-envio] Token expirado para loja '${storeId}'. Reconecte em /painel/integracoes` +
      ` — ${err instanceof Error ? err.message : String(err)}`
    )
  }
}

// ─── Origem do envio ──────────────────────────────────────────────────────────

export async function getShippingOrigin(storeId: string): Promise<ShippingOrigin> {
  // Prioridade 1: tabela stores no Supabase
  try {
    const sb = createServiceClient()
    const { data, error } = await sb
      .from('stores')
      .select('shipping_from_cep, shipping_from_nome, shipping_from_rua, shipping_from_numero, shipping_from_bairro, shipping_from_cidade, shipping_from_uf')
      .eq('store_id', storeId)
      .single()

    if (!error && data?.shipping_from_cep) {
      return {
        nome: data.shipping_from_nome ?? '',
        cep: data.shipping_from_cep,
        rua: data.shipping_from_rua ?? '',
        numero: data.shipping_from_numero ?? '',
        bairro: data.shipping_from_bairro ?? '',
        cidade: data.shipping_from_cidade ?? '',
        uf: data.shipping_from_uf ?? '',
      }
    }
  } catch {
    // falha silenciosa — tenta fallback abaixo
  }

  // Prioridade 2: store-config.json
  const config = loadStoreConfig(storeId)
  const me = config.melhor_envio

  if (!me.from_cep) {
    throw new Error(
      `[melhor-envio] Endereço de origem não configurado para loja '${storeId}'. ` +
      `Preencha shipping_from_* na tabela stores ou from_* no store-config.json`
    )
  }

  return {
    nome: me.from_nome ?? '',
    cep: me.from_cep,
    rua: me.from_rua ?? '',
    numero: me.from_numero ?? '',
    bairro: me.from_bairro ?? '',
    cidade: me.from_cidade ?? '',
    uf: me.from_uf ?? '',
  }
}

// ─── API pública ──────────────────────────────────────────────────────────────

export async function calcularFrete(
  storeId: string,
  params: {
    cepDestino: string
    produtos: Array<{
      id: string
      nome: string
      peso: number
      altura: number
      largura: number
      comprimento: number
      valor: number
      quantidade: number
    }>
  }
) {
  const [token, origin] = await Promise.all([
    getMEToken(storeId),
    getShippingOrigin(storeId),
  ])

  const body = {
    from: { postal_code: origin.cep.replace(/\D/g, '') },
    to: { postal_code: params.cepDestino.replace(/\D/g, '') },
    products: params.produtos.map(p => ({
      id: p.id,
      width: p.largura,
      height: p.altura,
      length: p.comprimento,
      weight: p.peso,
      insurance_value: p.valor,
      quantity: p.quantidade,
    })),
    options: {
      receipt: false,
      own_hand: false,
      insurance_value: params.produtos.reduce(
        (acc, p) => acc + p.valor * p.quantidade, 0
      ),
    },
    services: '1,2,3,4', // PAC, SEDEX e outros
  }

  const res = await fetch(`${ME_BASE_URL}/me/shipment/calculate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'TaPraPesca (contato@taprapesca.com.br)',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Melhor Envio error: ${err}`)
  }

  const data = await res.json()

  return data
    .filter((s: any) => !s.error && s.price)
    .map((s: any) => ({
      id: s.id,
      nome: s.name,
      empresa: s.company?.name || '',
      preco: Number(s.price),
      prazo: s.delivery_time,
      logo: s.company?.picture || '',
    }))
    .sort((a: any, b: any) => a.preco - b.preco)
}

export async function melhorEnvioFetch(
  storeId: string,
  endpoint: string,
  options?: RequestInit
): Promise<any> {
  const token = await getMEToken(storeId)

  const res = await fetch(`${ME_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'User-Agent': 'TaPraPesca (contato@taprapesca.com.br)',
      ...(options?.headers ?? {}),
    },
  })

  const text = await res.text()
  if (!text || text.trim() === '') return { ok: true }

  let parsed: any
  try {
    parsed = JSON.parse(text)
  } catch {
    return { ok: true, raw: text }
  }

  if (!res.ok) {
    throw new Error(`ME API error (${res.status}): ${text}`)
  }

  return parsed
}
