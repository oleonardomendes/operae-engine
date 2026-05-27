export interface StoreInfo {
  nome: string
  segmento: string
  regime: string
  store_id: string
}

export interface IntegrationStatus {
  bling: boolean
  mercado_pago: boolean
  melhor_envio: boolean
}

export interface OAuthAction {
  url: string
  plataforma: string
}
