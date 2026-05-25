import { MercadoPagoConfig, Payment } from 'mercadopago'
import { getMPAccessToken } from '@/lib/mercado-pago'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return Response.json({ error: 'ID obrigatório' }, { status: 400 })

  try {
    // TODO: extrair storeId do contexto do usuário autenticado quando multi-tenant estiver ativo
    const storeId = 'taprapesca'
    const accessToken = await getMPAccessToken(storeId)
    const client = new MercadoPagoConfig({ accessToken })
    const payment = new Payment(client)
    const data = await payment.get({ id: Number(id) })
    return Response.json({ status: data.status })
  } catch {
    return Response.json({ status: 'unknown' })
  }
}
