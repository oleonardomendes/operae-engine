'use client'

import { useState } from 'react'
import Link from 'next/link'
import StoreHeader from '@/components/StoreHeader'
import StoreFooter from '@/components/StoreFooter'

const grupos = [
  {
    titulo: 'Pedido e pagamento',
    itens: [
      {
        q: 'Quais formas de pagamento são aceitas?',
        a: 'Aceitamos cartão de crédito, Pix e boleto bancário. O Pix tem aprovação imediata e 5% de desconto; o boleto pode levar até 2 dias úteis para ser compensado.',
      },
      {
        q: 'Posso parcelar minha compra?',
        a: 'Sim, aceitamos parcelamento no cartão de crédito em até 12x. O número de parcelas disponíveis aparece no checkout.',
      },
      {
        q: 'Meu pedido foi aprovado. E agora?',
        a: 'Após a confirmação do pagamento, você receberá um e-mail de confirmação. O pedido é preparado e despachado em até 2 dias úteis.',
      },
    ],
  },
  {
    titulo: 'Entrega',
    itens: [
      {
        q: 'Qual o prazo de entrega?',
        a: 'O prazo é calculado no checkout conforme o seu CEP. Em média, entregas para o interior de SP levam de 3 a 5 dias úteis após o despacho.',
      },
      {
        q: 'Como rastrear meu pedido?',
        a: 'Você receberá o código de rastreamento por e-mail assim que o pedido for despachado. Também é possível rastrear pelo link "Rastrear pedido" no menu do site.',
      },
      {
        q: 'Os kits têm frete grátis?',
        a: 'Sim! Todos os kits da página de Kits Especiais têm frete grátis para todo o Brasil.',
      },
    ],
  },
  {
    titulo: 'Trocas e devoluções',
    itens: [
      {
        q: 'Posso devolver um produto?',
        a: null,
        aJsx: (
          <>
            Sim. Pelo Código de Defesa do Consumidor, você tem até 7 dias após o recebimento
            para solicitar devolução por qualquer motivo. Veja nossa{' '}
            <Link href="/trocas" style={{ color: 'var(--g500)', textDecoration: 'underline' }}>
              política completa
            </Link>{' '}
            de trocas e devoluções.
          </>
        ),
      },
      {
        q: 'O produto chegou com defeito. O que faço?',
        a: 'Entre em contato pelo WhatsApp ou e-mail com foto ou vídeo do defeito e o número do pedido. Resolveremos sem custo para você.',
      },
    ],
  },
  {
    titulo: 'Produtos',
    itens: [
      {
        q: 'Os produtos têm garantia?',
        a: 'Sim, todos os produtos têm garantia de fábrica. O prazo varia por produto — em caso de dúvida, fale conosco.',
      },
      {
        q: 'Não encontrei o produto que procuro.',
        a: 'Fale com a gente pelo WhatsApp — podemos verificar disponibilidade e prazos para você.',
      },
      {
        q: 'Tenho dúvida sobre qual equipamento escolher.',
        a: 'É só nos chamar no WhatsApp. Ajudamos a montar o equipamento ideal para o seu estilo e tipo de pesca.',
      },
    ],
  },
]

export default function FaqPage() {
  const [aberto, setAberto] = useState<string | null>(null)

  return (
    <>
      <StoreHeader />
      <main style={{ background: 'var(--cream)', minHeight: '60vh', padding: '60px 6%' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h1 style={h1}>Perguntas Frequentes</h1>

          {grupos.map((grupo, gi) => (
            <div key={gi} style={{ marginBottom: '40px' }}>
              <h2 style={h2}>{grupo.titulo}</h2>
              {grupo.itens.map((item, ii) => {
                const key = `${gi}-${ii}`
                const isOpen = aberto === key
                return (
                  <div key={ii} style={{ borderBottom: '1px solid var(--border)' }}>
                    <button
                      onClick={() => setAberto(isOpen ? null : key)}
                      aria-expanded={isOpen}
                      style={{
                        width: '100%', background: 'none', border: 'none',
                        textAlign: 'left', padding: '18px 0',
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', gap: '16px', cursor: 'pointer',
                        fontFamily: 'var(--ff-body)', fontSize: '15px',
                        fontWeight: '700', color: 'var(--g900)',
                      }}
                    >
                      {item.q}
                      <span style={{
                        width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                        background: isOpen ? 'var(--g700)' : 'var(--border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'background .2s, transform .3s',
                        transform: isOpen ? 'rotate(45deg)' : 'none',
                      }}>
                        <svg viewBox="0 0 24 24" width="11" height="11"
                          fill={isOpen ? '#fff' : 'var(--g700)'}>
                          <path d="M12 5v14M5 12h14" stroke={isOpen ? '#fff' : 'var(--g700)'}
                            strokeWidth="2.5" />
                        </svg>
                      </span>
                    </button>
                    {isOpen && (
                      <p style={{ ...pStyle, paddingBottom: '18px' }}>
                        {item.aJsx ?? item.a}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          ))}

          <div style={{ marginTop: '40px', padding: '28px', background: '#fff',
            border: '1px solid var(--border)', borderRadius: 'var(--r-lg)' }}>
            <p style={{ ...pStyle, marginBottom: '20px' }}>
              Não encontrou o que procurava? Fale diretamente com a gente.
            </p>
            <a
              href="https://wa.me/5515996177133"
              target="_blank" rel="noopener noreferrer"
              style={btnWpp}
            >
              Falar no WhatsApp →
            </a>
          </div>
        </div>
      </main>
      <StoreFooter />
    </>
  )
}

const h1: React.CSSProperties = {
  fontFamily: 'var(--ff-display)', fontSize: '42px',
  color: 'var(--g900)', marginBottom: '32px', letterSpacing: '.02em',
}

const h2: React.CSSProperties = {
  fontSize: '20px', fontWeight: '700', color: 'var(--g900)',
  marginTop: '0', marginBottom: '4px',
  paddingBottom: '8px', borderBottom: '1px solid var(--border)',
}

const pStyle: React.CSSProperties = {
  fontSize: '15px', color: 'var(--muted)', lineHeight: '1.75',
  fontFamily: 'var(--ff-body)', marginBottom: '0',
}

const btnWpp: React.CSSProperties = {
  display: 'inline-block', background: '#25D366', color: '#fff',
  fontWeight: '700', fontSize: '15px', padding: '13px 28px',
  borderRadius: '50px', textDecoration: 'none',
}
