import type { Metadata } from 'next'
import Link from 'next/link'
import StoreHeader from '@/components/StoreHeader'
import StoreFooter from '@/components/StoreFooter'
import { resolveStoreId } from '@/lib/store-id'
import { loadStoreConfig } from '@/lib/store-config'

export async function generateMetadata(): Promise<Metadata> {
  const storeId = await resolveStoreId()
  const config = loadStoreConfig(storeId)
  return {
    title: `Como Comprar — ${config.nome}`,
    description: `Passo a passo para comprar na ${config.nome}.`,
  }
}

const steps = [
  {
    num: '1',
    title: 'Escolha seu produto',
    desc: (
      <>
        Navegue pelas categorias (Varas, Molinetes, Carretilhas, Linhas) ou use a barra de
        busca. Para kits completos com frete grátis, acesse a página de{' '}
        <Link href="/kits" style={{ color: 'var(--g500)', textDecoration: 'underline' }}>
          Kits Especiais
        </Link>.
      </>
    ),
  },
  {
    num: '2',
    title: 'Adicione ao carrinho',
    desc: 'Clique em "Adicionar ao carrinho" para continuar comprando ou "Comprar agora" para ir direto ao checkout.',
  },
  {
    num: '3',
    title: 'Finalize o pedido',
    desc: 'Informe seu endereço, calcule o frete e escolha a forma de pagamento. Aceitamos cartão de crédito, Pix e boleto.',
  },
  {
    num: '4',
    title: 'Acompanhe a entrega',
    desc: 'Após a confirmação do pagamento, você recebe um e-mail com o código de rastreamento.',
  },
]

export default async function ComoComprarPage() {
  const storeId = await resolveStoreId()
  const config = loadStoreConfig(storeId)
  const waNumber = config.contato?.whatsapp ?? ''

  return (
    <>
      <StoreHeader />
      <main style={{ background: 'var(--cream)', minHeight: '60vh', padding: '60px 6%' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h1 style={h1}>Como Comprar</h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '48px' }}>
            {steps.map(s => (
              <div key={s.num} style={{
                display: 'flex', gap: '20px', alignItems: 'flex-start',
                background: '#fff', border: '1px solid var(--border)',
                borderRadius: 'var(--r-lg)', padding: '24px',
              }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                  background: 'var(--g700)', color: '#fff', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--ff-display)', fontSize: '20px', fontWeight: '700',
                }}>
                  {s.num}
                </div>
                <div>
                  <p style={{ fontSize: '16px', fontWeight: '700', color: 'var(--g900)',
                    marginBottom: '6px', fontFamily: 'var(--ff-body)' }}>
                    {s.title}
                  </p>
                  <p style={p}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 style={h2}>Formas de pagamento</h2>
          <ul style={ul}>
            <li style={li}>Cartão de crédito (até 12x no cartão)</li>
            <li style={li}>Pix (5% de desconto e aprovação imediata)</li>
            <li style={li}>Boleto bancário (aprovação em até 2 dias úteis)</li>
          </ul>

          <h2 style={h2}>Prazo de entrega</h2>
          <p style={p}>
            O prazo é calculado no checkout conforme o seu CEP. Após a confirmação do
            pagamento, o pedido é despachado em até 2 dias úteis.
          </p>

          <div style={{ marginTop: '40px', padding: '28px', background: '#fff',
            border: '1px solid var(--border)', borderRadius: 'var(--r-lg)' }}>
            <p style={{ ...p, marginBottom: '20px' }}>
              Ficou com dúvida? Nossa equipe responde rápido.
            </p>
            {waNumber && (
              <a
                href={`https://wa.me/${waNumber}`}
                target="_blank" rel="noopener noreferrer"
                style={btnWpp}
              >
                Falar no WhatsApp →
              </a>
            )}
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
  marginTop: '36px', marginBottom: '12px',
  paddingBottom: '8px', borderBottom: '1px solid var(--border)',
}

const p: React.CSSProperties = {
  fontSize: '16px', color: 'var(--muted)', lineHeight: '1.75',
  marginBottom: '0', fontFamily: 'var(--ff-body)',
}

const ul: React.CSSProperties = {
  listStyle: 'none', display: 'flex', flexDirection: 'column',
  gap: '8px', marginBottom: '20px', paddingLeft: '4px',
}

const li: React.CSSProperties = {
  fontSize: '15px', color: 'var(--muted)', lineHeight: '1.75',
}

const btnWpp: React.CSSProperties = {
  display: 'inline-block', background: '#25D366', color: '#fff',
  fontWeight: '700', fontSize: '15px', padding: '13px 28px',
  borderRadius: '50px', textDecoration: 'none',
}
