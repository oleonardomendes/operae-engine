import { MercadoPagoConfig, Preference } from 'mercadopago'
import { NextResponse } from 'next/server'
import { getMPAccessToken } from '@/lib/mercado-pago'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const { kitId, kitNome, kitPreco, backUrls, items: cartItems, freteValor = 0, freteServico = 'Frete' } = await req.json()

    const mpItems = cartItems
      ? cartItems.map((i: { id: number; nome: string; preco: number; quantidade: number }) => ({
          id: String(i.id),
          title: i.nome,
          quantity: i.quantidade,
          unit_price: Number(i.preco),
          currency_id: 'BRL',
        }))
      : [{
          id: String(kitId),
          title: `${kitNome} + ${freteServico}`,
          description: `Produto: R$ ${Number(kitPreco).toFixed(2).replace('.', ',')} | Frete: R$ ${Number(freteValor).toFixed(2).replace('.', ',')}`,
          quantity: 1,
          unit_price: Number(kitPreco) + Number(freteValor),
          currency_id: 'BRL',
        }]

    // TODO: extrair storeId do contexto do usuário autenticado quando multi-tenant estiver ativo
    const storeId = 'taprapesca'
    const accessToken = await getMPAccessToken(storeId)
    const client = new MercadoPagoConfig({ accessToken })

    const userId = req.headers.get('x-user-id') || null
    const pedidoId = crypto.randomUUID()

    console.log('[preference] pedidoId gerado:', pedidoId)
    console.log('[preference] external_reference no body:', { external_reference: pedidoId })

    const preference = new Preference(client)
    const result = await preference.create({
      body: {
        items: mpItems,
        external_reference: pedidoId,
        metadata: {
          user_id: userId,
          frete_valor: freteValor,
          frete_servico: freteServico || null,
        },
        back_urls: backUrls ?? {
          success: 'https://taprapesca.com.br/obrigado?status=approved',
          failure: 'https://taprapesca.com.br/checkout?erro=pagamento',
          pending: 'https://taprapesca.com.br/obrigado?status=pending',
        },
        payment_methods: {
          excluded_payment_types: [
            { id: 'ticket' },
            { id: 'bank_transfer' },
            { id: 'atm' },
          ],
          installments: 12,
          default_installments: 1,
        },
        auto_return: 'approved',
        statement_descriptor: 'TA PRA PESCA',
      }
    })

    console.log('[preference] criada:', result.id, 'external_ref:', result.external_reference)

    const checkoutUrl = process.env.NEXT_PUBLIC_MP_ENV === 'test'
      ? result.sandbox_init_point
      : result.init_point

    return NextResponse.json({ preferenceId: result.id, checkoutUrl, pedidoId })
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: 500 }
    )
  }
}
