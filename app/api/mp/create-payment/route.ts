import { MercadoPagoConfig, Payment } from 'mercadopago'
import { NextResponse } from 'next/server'
import { getMPAccessToken } from '@/lib/mercado-pago'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { formData, amount, description, pedidoId } = body

    // TODO: extrair storeId do contexto do usuário autenticado quando multi-tenant estiver ativo
    const storeId = 'taprapesca'
    const accessToken = await getMPAccessToken(storeId)
    const client = new MercadoPagoConfig({ accessToken })

    const payment = new Payment(client)
    const result = await payment.create({
      body: {
        transaction_amount: Number(amount),
        description,
        payment_method_id: 'pix',
        external_reference: pedidoId || '',
        payer: {
          email: formData?.payer?.email || 'pix@taprapesca.com.br',
        },
        notification_url: 'https://www.taprapesca.com.br/api/mp/webhook',
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
