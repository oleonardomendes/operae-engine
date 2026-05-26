import { headers } from 'next/headers'

export async function resolveStoreId(): Promise<string> {
  const headersList = await headers()
  const host = headersList.get('host') ?? ''

  // Em produção: extrai do subdomínio (ex: loja-a.operae.com.br → 'loja-a')
  const parts = host.split('.')
  const isOperaeSubdomain = host.includes('operae.com.br')

  if (isOperaeSubdomain && parts[0] && parts[0] !== 'www') {
    return parts[0]
  }

  // Domínio próprio: por enquanto usa STORE_ID como fallback
  // TODO: buscar na tabela stores pelo domínio (host) para suporte a domínios próprios

  const storeId = process.env.STORE_ID
  if (!storeId) {
    throw new Error(
      '[store-id] Não foi possível determinar o storeId. ' +
      'Em desenvolvimento, defina STORE_ID no .env.local'
    )
  }

  return storeId
}
