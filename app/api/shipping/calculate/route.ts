import { NextResponse } from 'next/server'
import { calcularFrete } from '@/lib/melhor-envio'
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

    const { cepDestino, produtos } = await req.json()

    if (!cepDestino) {
      return Response.json({ error: 'CEP obrigatório' }, { status: 400 })
    }

    const opcoes = await calcularFrete(storeId, { cepDestino, produtos })
    return Response.json({ opcoes })
  } catch (e: any) {
    console.error('[shipping]', e.message)
    return Response.json({ error: e.message }, { status: 500 })
  }
}
