import { getIntegrationToken } from './integrations'

export const MP_API_URL = 'https://api.mercadopago.com'

export async function getMPAccessToken(storeId: string): Promise<string> {
  // Em desenvolvimento local com NODE_ENV=development e MP_ACCESS_TOKEN_TEST definido,
  // usa o token de teste para não cobrar transações reais
  if (process.env.NODE_ENV === 'development' && process.env.MP_ACCESS_TOKEN_TEST) {
    return process.env.MP_ACCESS_TOKEN_TEST
  }

  // Em produção, sempre busca o token OAuth do cliente no banco
  return getIntegrationToken(storeId, 'mercado_pago')
}
