import { MercadoPagoConfig, Preference } from 'mercadopago'
import { NextResponse } from 'next/server'
import { getMPAccessToken } from '@/lib/mercado-pago'
import { loadStoreConfig } from '@/lib/store-config'
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

    const accessToken = await getMPAccessToken(storeId)
    const client = new MercadoPagoConfig({ accessToken })
    const config = loadStoreConfig(storeId)

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
    const pedidoId = crypto.randomUUID()

    console.log('[preference] pedidoId gerado:', pedidoId)
    console.log('[preference] external_reference no body:', { external_reference: `${storeId}:${pedidoId}` })

    const preference = new Preference(client)
    const result = await preference.create({
      body: {
        items: mpItems,
        external_reference: `${storeId}:${pedidoId}`,
        metadata: {
          store_id: storeId,
          user_id: user.id,
          frete_valor: freteValor,
          frete_servico: freteServico || null,
        },
        back_urls: backUrls ?? {
          success: `${appUrl}/obrigado?status=approved`,
          failure: `${appUrl}/checkout?erro=pagamento`,
          pending: `${appUrl}/obrigado?status=pending`,
        },
        notification_url: `${appUrl}/api/mp/webhook?store_id=${storeId}`,
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
        statement_descriptor: config.nome.toUpperCase().slice(0, 22),
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
