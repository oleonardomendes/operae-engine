import { MercadoPagoConfig, Payment } from 'mercadopago'
import { NextResponse } from 'next/server'
import { getMPAccessToken } from '@/lib/mercado-pago'
import { createAuthClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return Response.json({ error: 'ID obrigatório' }, { status: 400 })

  const supabase = createAuthClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const storeId = user.user_metadata?.store_id
  if (!storeId) {
    return NextResponse.json(
      { error: 'store_id não encontrado no usuário. Configure o onboarding.' },
      { status: 400 }
    )
  }

  try {
    const accessToken = await getMPAccessToken(storeId)
    const client = new MercadoPagoConfig({ accessToken })
    const payment = new Payment(client)
    const data = await payment.get({ id: Number(id) })
    return Response.json({ status: data.status })
  } catch {
    return Response.json({ status: 'unknown' })
  }
}
