import { MercadoPagoConfig, Payment } from 'mercadopago'
import { NextResponse } from 'next/server'
import { getMPAccessToken } from '@/lib/mercado-pago'
import { createAuthClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
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

    const body = await req.json()
    const { formData, amount, description, pedidoId } = body

    const accessToken = await getMPAccessToken(storeId)
    const client = new MercadoPagoConfig({ accessToken })

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

    const payment = new Payment(client)
    const result = await payment.create({
      body: {
        transaction_amount: Number(amount),
        description,
        payment_method_id: 'pix',
        external_reference: `${storeId}:${pedidoId || ''}`,
        payer: {
          email: formData?.payer?.email || user.email || 'pagamento@operae.com.br',
        },
        notification_url: `${appUrl}/api/mp/webhook?store_id=${storeId}`,
      },
    })

    return NextResponse.json({
      id: result.id,
      status: result.status,
      qrCode: result.point_of_interaction?.transaction_data?.qr_code,
      qrCodeBase64: result.point_of_interaction?.transaction_data?.qr_code_base64,
      ticketUrl: result.point_of_interaction?.transaction_data?.ticket_url,
    })
  } catch (e: any) {
    console.error('[create-payment] erro:', {
      message: e.message,
      status: e.status,
      cause: e.cause,
      env: process.env.NEXT_PUBLIC_MP_ENV,
      temToken: !!process.env.MP_ACCESS_TOKEN_TEST,
    })
    return Response.json({
      error: e.message,
      detail: e.cause || null,
    }, { status: 500 })
  }
}
