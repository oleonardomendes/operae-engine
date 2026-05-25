import { MercadoPagoConfig, Payment } from 'mercadopago'
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { blingFetch } from '@/lib/bling'
import { melhorEnvioFetch, getShippingOrigin } from '@/lib/melhor-envio'
import { getMPAccessToken } from '@/lib/mercado-pago'
import { loadStoreConfig } from '@/lib/store-config'

export const dynamic = 'force-dynamic'

const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url)
  const storeId = searchParams.get('store_id')

  const body = await req.json()

  const type = body?.type || body?.topic
  const paymentId = body?.data?.id || body?.resource

  if (type !== 'payment' || !paymentId) {
    return NextResponse.json({ ok: true })
  }

  console.log('[webhook] recebido:', JSON.stringify(body))

  if (!storeId) {
    console.error('[webhook] store_id ausente na URL. Configure notification_url com ?store_id=')
    await supabase.from('operation_logs').insert({
      tipo: 'webhook_erro',
      descricao: 'store_id ausente na URL do webhook MP',
      payload: { paymentId },
    }).catch(() => {})
    return NextResponse.json({ error: 'store_id não determinado' }, { status: 400 })
  }

  const config = loadStoreConfig(storeId)

  try {
    const accessToken = await getMPAccessToken(storeId)
    const client = new MercadoPagoConfig({ accessToken })

    // Busca dados do pagamento no MP
    let data: any
    try {
      const payment = new Payment(client)
      data = await payment.get({ id: paymentId })
    } catch (e: any) {
      console.log('[webhook] pagamento não encontrado:', paymentId)
      return NextResponse.json({ ok: true })
    }

    console.log('[webhook] status:', data.status, 'ref:', data.external_reference)

    if (data.status !== 'approved') return NextResponse.json({ ok: true })

    const externalRef = data.external_reference ?? ''
    // Formato novo: 'storeId:pedidoUuid' — extrai só o UUID
    const pedidoUuid = externalRef.includes(':') ? externalRef.split(':').slice(1).join(':') : externalRef

    let pedidoId: string | null = null

    if (pedidoUuid) {
      const { data: updated, error } = await supabase
        .from('pedidos')
        .update({
          status: 'aprovado',
          mp_payment_id: String(paymentId),
          updated_at: new Date().toISOString(),
        })
        .eq('id', pedidoUuid)
        .select()
        .single()

      if (error) {
        console.error('[webhook] erro ao atualizar:', error)
      } else {
        console.log('[webhook] pedido atualizado:', updated.id)
        pedidoId = updated.id
      }
    }

    // Fallback: cria novo pedido se não encontrou pelo external_reference
    if (!pedidoId) {
      const { data: novo } = await supabase
        .from('pedidos')
        .insert({
          mp_payment_id: String(paymentId),
          status: 'aprovado',
          total: data.transaction_amount || 0,
          itens: [],
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      pedidoId = novo?.id || null
      console.log('[webhook] novo pedido criado (fallback):', pedidoId)
    }

    // Busca dados completos do pedido
    const { data: pedidoCompleto } = await supabase
      .from('pedidos')
      .select('*')
      .eq('id', pedidoId!)
      .single()

    if (!pedidoCompleto) return NextResponse.json({ ok: true })

    // Lock distribuído: só processa se bling_pedido_id ainda for null
    const { data: lockResult } = await supabase
      .from('pedidos')
      .update({ bling_pedido_id: 'processing' })
      .eq('id', pedidoId!)
      .is('bling_pedido_id', null)
      .select('id')
      .single()

    if (!lockResult) {
      console.log('[webhook] pedido já sendo processado por outro webhook')
      return NextResponse.json({ ok: true })
    }

    console.log('[webhook] lock adquirido, processando Bling...')

    // Nome do cliente: Supabase Auth (logado) > guest_nome > MP payer > fallback
    let nomeCliente = ''
    if (pedidoCompleto.user_id) {
      try {
        const { data: userData } = await supabase.auth.admin.getUserById(
          pedidoCompleto.user_id
        )
        nomeCliente = userData?.user?.user_metadata?.nome || ''
      } catch {}
    } else {
      nomeCliente = pedidoCompleto.guest_nome ?? ''
    }
    if (!nomeCliente) {
      nomeCliente = data.payer?.first_name
        ? `${data.payer.first_name} ${data.payer.last_name || ''}`.trim()
        : 'Cliente'
    }

    const cpfLimpo = (pedidoCompleto.cpf || '').replace(/\D/g, '')
    const emailPagador = data.payer?.email || ''
    const emailValido = typeof pedidoCompleto.guest_email === 'string' &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pedidoCompleto.guest_email)
      ? pedidoCompleto.guest_email : undefined

    console.log('[webhook] nome final:', nomeCliente, '| email:', emailPagador, '| emailValido:', !!emailValido)

    // Parse do endereço (vem como string do Supabase)
    const enderecoParsed = pedidoCompleto.endereco
      ? (typeof pedidoCompleto.endereco === 'string'
          ? JSON.parse(pedidoCompleto.endereco)
          : pedidoCompleto.endereco)
      : null

    console.log('[webhook] endereco parsed:', JSON.stringify(enderecoParsed))

    // ============================================
    // BLOCO DE CONTATO — busca primeiro, cria se não existe
    // ============================================

    let contatoId: number | null = null

    // ETAPA 1: Busca por CPF com parâmetro correto
    if (cpfLimpo) {
      try {
        await delay(300)
        // Tenta encontrar com diferentes criterios (1=ativo, 2=excluido, 3=inativo, 4=todos)
        let lista: any[] = []

        for (const criterio of [1, 2, 3, 4]) {
          if (lista.length > 0) break
          try {
            const r = await blingFetch(
              storeId,
              `/contatos?numeroDocumento=${cpfLimpo}&criterio=${criterio}&limite=5`
            )
            lista = r?.data || []
            console.log('[webhook] busca criterio', criterio, '->', lista.length)
          } catch {}
        }

        if (lista.length > 0) {
          const contato = lista[0]
          contatoId = contato.id
          console.log('[webhook] contato encontrado:', contatoId, contato.nome, contato.situacao)

          // Se contato está deletado, reativa
          if (contato.situacao === 'E' || contato.situacao === 'I') {
            try {
              await delay(300)
              await blingFetch(storeId, `/contatos/${contatoId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  nome: contato.nome === 'Cliente' || contato.nome === 'Consumidor Final'
                    ? nomeCliente
                    : contato.nome,
                  tipo: 'F',
                  situacao: 'A',
                  endereco: {
                    geral: {
                      endereco: enderecoParsed?.logradouro || '',
                      cep: (enderecoParsed?.cep || '').replace(/\D/g, ''),
                      bairro: enderecoParsed?.bairro || '',
                      municipio: enderecoParsed?.cidade || '',
                      uf: enderecoParsed?.estado || '',
                      numero: enderecoParsed?.numero || '',
                      complemento: enderecoParsed?.complemento || '',
                    },
                  },
                }),
              })
              console.log('[webhook] contato reativado:', contatoId)
            } catch (reErr: any) {
              console.log('[webhook] erro reativar:', reErr.message.slice(0, 80))
            }
          } else {
            // Contato ativo — atualiza endereço
            try {
              await delay(300)
              await blingFetch(storeId, `/contatos/${contatoId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  nome: contato.nome,
                  tipo: 'F',
                  situacao: 'A',
                  endereco: {
                    geral: {
                      endereco: enderecoParsed?.logradouro || '',
                      cep: (enderecoParsed?.cep || '').replace(/\D/g, ''),
                      bairro: enderecoParsed?.bairro || '',
                      municipio: enderecoParsed?.cidade || '',
                      uf: enderecoParsed?.estado || '',
                      numero: enderecoParsed?.numero || '',
                      complemento: enderecoParsed?.complemento || '',
                    },
                  },
                }),
              })
              console.log('[webhook] endereço atualizado no contato existente')
            } catch {}
          }
        }
      } catch (bErr: any) {
        console.log('[webhook] erro busca numeroDocumento:', bErr.message.slice(0, 80))
      }
    }

    // ETAPA 2: Só cria se não encontrou por CPF
    if (!contatoId) {
      try {
        await delay(300)
        const res = await blingFetch(storeId, '/contatos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nome: nomeCliente,
            tipo: 'F',
            situacao: 'A',
            numeroDocumento: cpfLimpo || undefined,
            email: emailValido,
            endereco: {
              geral: {
                endereco: enderecoParsed?.logradouro || '',
                cep: (enderecoParsed?.cep || '').replace(/\D/g, ''),
                bairro: enderecoParsed?.bairro || '',
                municipio: enderecoParsed?.cidade || '',
                uf: enderecoParsed?.estado || '',
                numero: enderecoParsed?.numero || '',
                complemento: enderecoParsed?.complemento || '',
              },
            },
          }),
        })
        contatoId = res?.data?.id || null
        console.log('[webhook] contato criado:', contatoId, nomeCliente)
      } catch (e: any) {
        console.log('[webhook] erro criar contato:', e.message.slice(0, 100))

        // CPF conflita mas busca não encontrou (contato excluído definitivamente)
        // Cria sem CPF como último recurso
        try {
          await delay(300)
          const res = await blingFetch(storeId, '/contatos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              nome: nomeCliente,
              tipo: 'F',
              situacao: 'A',
              email: emailValido,
              endereco: {
                geral: {
                  endereco: enderecoParsed?.logradouro || '',
                  cep: (enderecoParsed?.cep || '').replace(/\D/g, ''),
                  bairro: enderecoParsed?.bairro || '',
                  municipio: enderecoParsed?.cidade || '',
                  uf: enderecoParsed?.estado || '',
                  numero: enderecoParsed?.numero || '',
                  complemento: enderecoParsed?.complemento || '',
                },
              },
            }),
          })
          contatoId = res?.data?.id || null
          console.log('[webhook] contato sem CPF criado:', contatoId)
        } catch (e3: any) {
          console.error('[webhook] falha total contato:', e3.message.slice(0, 80))
        }
      }
    }

    if (!contatoId) {
      await supabase.from('pedidos')
        .update({ bling_pedido_id: null })
        .eq('id', pedidoId!)
      return NextResponse.json({ ok: true })
    }

    // ============================================
    // A PARTIR DAQUI: SEMPRE CRIA O PEDIDO
    // ============================================

    const itensPedido = Array.isArray(pedidoCompleto.itens)
      ? pedidoCompleto.itens
      : JSON.parse(typeof pedidoCompleto.itens === 'string' ? pedidoCompleto.itens : '[]')

    console.log('[webhook] itens do pedido:', JSON.stringify(itensPedido))

    const hoje = new Date().toISOString().split('T')[0]

    const pesoTotal = itensPedido.reduce((acc: number, item: any) =>
      acc + (Number(item.peso) || 0.5) * (Number(item.quantidade) || 1), 0
    )

    const blingBody = {
      data: hoje,
      numero: String(paymentId).slice(-6),
      numeroPedidoCompra: String(paymentId),
      situacao: { id: 6 },
      contato: { id: contatoId },
      observacoes: `Pedido via site ${config.dominio} | MP: ${paymentId}`,
      transporte: {
        fretePorConta: 'D',
        frete: Number(pedidoCompleto.frete_valor) || 0,
        quantidadeVolumes: itensPedido.length,
        pesoBruto: Number(pesoTotal.toFixed(3)),
        volumes: [{ id: 1, servico: pedidoCompleto.frete_servico || 'Correios' }],
        etiqueta: enderecoParsed ? {
          nome: nomeCliente,
          endereco: enderecoParsed.logradouro || '',
          numero: enderecoParsed.numero || '',
          complemento: enderecoParsed.complemento || '',
          bairro: enderecoParsed.bairro || '',
          municipio: enderecoParsed.cidade || '',
          uf: enderecoParsed.estado || '',
          cep: (enderecoParsed.cep || '').replace(/\D/g, ''),
          nomePais: 'Brasil',
        } : undefined,
      },
      itens: itensPedido.length > 0
        ? itensPedido.map((item: any, index: number) => {
            const produtoId = item.id && String(item.id).length >= 10
              ? Number(item.id)
              : null

            return {
              id: index + 1,
              ...(produtoId ? { produto: { id: produtoId } } : {}),
              descricao: item.nome || 'Produto',
              quantidade: Number(item.quantidade) || 1,
              valor: Number(item.valor) || 0,
              unidade: 'UN',
            }
          })
        : [{
            id: 1,
            descricao: `Pedido ${config.nome}`,
            quantidade: 1,
            valor: Math.max(0, Number(pedidoCompleto.total) - Number(pedidoCompleto.frete_valor || 0)),
            unidade: 'UN',
          }],
    }

    let blingPedidoId: any = null

    try {
      await delay(600)
      console.log('[webhook] criando pedido Bling...')
      const blingRes = await blingFetch(storeId, '/pedidos/vendas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blingBody),
      })

      blingPedidoId = blingRes?.data?.id
      console.log('[webhook] pedido Bling criado:', blingPedidoId)

      await supabase.from('pedidos')
        .update({ bling_pedido_id: String(blingPedidoId) })
        .eq('id', pedidoId!)

    } catch (bErr: any) {
      console.error('[webhook] erro criar pedido Bling:', bErr.message)

      const isDuplicata = bErr.message.includes('"code":3')
        || bErr.message.includes('"code":50')
        || bErr.message.includes('idênticas')
        || bErr.message.includes('mesma situa')

      if (isDuplicata) {
        console.log('[webhook] pedido já existe no Bling — marcando como processado')
        await supabase.from('pedidos')
          .update({ bling_pedido_id: 'duplicata-bling' })
          .eq('id', pedidoId!)
      } else {
        await supabase.from('pedidos')
          .update({ bling_pedido_id: null })
          .eq('id', pedidoId!)
      }
    }

    // Adiciona ao carrinho do Melhor Envio — roda sempre, novo ou duplicata
    if (!pedidoCompleto.me_carrinho_id && pedidoCompleto.frete_servico_id) {
      try {
        await delay(500)

        const meStoreId = storeId
        const origin = await getShippingOrigin(meStoreId)

        const meBody = {
          service: Number(pedidoCompleto.frete_servico_id),
          from: {
            name: origin.nome,
            phone: origin.phone,
            postal_code: origin.cep.replace(/\D/g, ''),
            address: origin.rua,
            city: origin.cidade,
          },
          to: {
            name: nomeCliente,
            postal_code: (enderecoParsed?.cep || '').replace(/\D/g, ''),
            address: enderecoParsed?.logradouro || '',
            number: enderecoParsed?.numero || '',
            complement: enderecoParsed?.complemento || '',
            district: enderecoParsed?.bairro || '',
            city: enderecoParsed?.cidade || '',
            state_abbr: enderecoParsed?.estado || '',
            document: cpfLimpo || '',
            email: emailValido || '',
          },
          products: itensPedido.map((item: any) => ({
            name: item.nome,
            quantity: Number(item.quantidade) || 1,
            unitary_value: Number(item.valor) || 0,
            weight: Number(item.peso) || 0.5,
          })),
          volumes: itensPedido.map((item: any) => ({
            height: Number(item.altura) || 15,
            width: Number(item.largura) || 15,
            length: Number(item.comprimento) || 30,
            weight: Number(item.peso) || 0.5,
          })),
          options: {
            insurance_value: Number(pedidoCompleto.total) || 0,
            receipt: false,
            own_hand: false,
            tags: [{
              tag: pedidoCompleto.id,
              url: `https://${config.dominio}/admin/pedidos/${pedidoCompleto.id}`,
            }],
          },
        }

        console.log('[webhook] ME body completo:', JSON.stringify(meBody))

        const meCarrinho = await melhorEnvioFetch(meStoreId, '/me/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(meBody),
        })

        const meCarrinhoId = meCarrinho?.id
        console.log('[webhook] ME carrinho criado:', meCarrinhoId)

        if (meCarrinhoId) {
          await supabase.from('pedidos')
            .update({ me_carrinho_id: meCarrinhoId })
            .eq('id', pedidoId!)

          if (blingPedidoId) {
            await delay(400)
            await blingFetch(storeId, `/pedidos/vendas/${blingPedidoId}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                observacoesInternas: `ME Carrinho ID: ${meCarrinhoId} | ` +
                  itensPedido.map((item: any) =>
                    `${item.nome}: ${item.peso || 0.5}kg | ` +
                    `${item.altura || 15}x${item.largura || 15}x${item.comprimento || 30}cm`
                  ).join(' | '),
              }),
            })
            console.log('[webhook] ME ID salvo no Bling')
          }
        }
      } catch (meErr: any) {
        console.log('[webhook] erro ME carrinho:', meErr.message)
      }
    }

    // Email de confirmação para usuários logados
    if (pedidoCompleto.user_id && !pedidoCompleto.guest_email) {
      try {
        const { data: userData } = await supabase.auth.admin
          .getUserById(pedidoCompleto.user_id)
        const emailUsuario = userData?.user?.email
        const meta = userData?.user?.user_metadata || {}
        const nomeUsuario = meta.full_name
          || meta.nome
          || meta.name
          || userData?.user?.email
          || 'Cliente'

        if (emailUsuario) {
          const { Resend } = await import('resend')
          const resend = new Resend(process.env.RESEND_API_KEY)

          const itens = Array.isArray(pedidoCompleto.itens)
            ? pedidoCompleto.itens
            : JSON.parse(pedidoCompleto.itens || '[]')

          const nomeProduto = itens[0]?.nome || 'Produto'
          const total = Number(pedidoCompleto.total || 0)
            .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

          await resend.emails.send({
            from: config.resend.from,
            to: emailUsuario,
            subject: `Pedido confirmado — ${config.nome}`,
            html: `
              <!DOCTYPE html>
              <html>
              <head><meta charset="utf-8"></head>
              <body style="font-family:sans-serif;background:#f5f0e8;margin:0;padding:40px 0;">
                <div style="max-width:560px;margin:0 auto;background:#fff;
                  border-radius:12px;overflow:hidden;border:1px solid #e0d8c8;">
                  <div style="background:#1a3a1a;padding:32px;text-align:center;">
                    <h1 style="color:#fff;margin:0;font-size:22px;letter-spacing:.05em;">${config.nome.toUpperCase()}</h1>
                  </div>
                  <div style="padding:40px 32px;">
                    <h2 style="color:#1a3a1a;margin:0 0 16px;font-size:20px;">
                      Pedido confirmado!
                    </h2>
                    <p style="color:#444;line-height:1.6;margin:0 0 24px;">
                      Olá, <strong>${nomeUsuario}</strong>!<br><br>
                      Recebemos seu pedido e já estamos separando tudo para você.
                    </p>
                    <div style="background:#f5f0e8;border-radius:8px;padding:16px;margin-bottom:24px;">
                      <div style="font-size:13px;color:#666;margin-bottom:8px;">Produto</div>
                      <div style="font-size:15px;font-weight:600;color:#1a3a1a;margin-bottom:12px;">
                        ${nomeProduto}
                      </div>
                      <div style="font-size:13px;color:#666;margin-bottom:4px;">Total</div>
                      <div style="font-size:20px;font-weight:700;color:#1a3a1a;">${total}</div>
                    </div>
                    <div style="text-align:center;">
                      <a href="https://${config.dominio}/conta"
                        style="background:#1a3a1a;color:#fff;padding:14px 32px;border-radius:50px;
                        text-decoration:none;font-weight:700;font-size:15px;display:inline-block;">
                        Acompanhar pedido →
                      </a>
                    </div>
                  </div>
                  <div style="background:#f5f0e8;padding:20px 32px;text-align:center;">
                    <p style="color:#888;font-size:12px;margin:0;">
                      ${config.nome} · ${config.resend.from}
                    </p>
                  </div>
                </div>
              </body>
              </html>
            `
          })

          console.log('[webhook] email confirmação enviado:', emailUsuario)
        }
      } catch (err) {
        console.error('[webhook] erro email confirmação:', err)
      }
    }

    // Criar conta automaticamente para guests
    if (!pedidoCompleto.user_id && pedidoCompleto.guest_email) {
      try {
        const { data: novoUser, error: inviteError } =
          await supabase.auth.admin.inviteUserByEmail(
            pedidoCompleto.guest_email,
            {
              data: {
                full_name: pedidoCompleto.guest_nome ?? '',
                cpf: pedidoCompleto.cpf ?? '',
              },
              redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/criar-senha`,
            }
          )

        if (inviteError) {
          if (inviteError.message.includes('already been registered')) {
            console.log('[webhook] conta já existe para:', pedidoCompleto.guest_email)
          } else {
            console.error('[webhook] erro ao criar conta guest:', inviteError.message)
          }
        } else if (novoUser?.user) {
          await supabase
            .from('pedidos')
            .update({ user_id: novoUser.user.id })
            .eq('id', pedidoCompleto.id)
          console.log('[webhook] conta guest criada e convite enviado:', pedidoCompleto.guest_email)
        }
      } catch (err) {
        console.error('[webhook] Erro ao criar conta guest:', err)
      }
    }

  } catch (e: any) {
    console.error('[webhook] erro geral:', e.message)
  }

  return NextResponse.json({ ok: true })
}
