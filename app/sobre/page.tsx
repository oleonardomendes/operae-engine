import type { Metadata } from 'next'
import Link from 'next/link'
import StoreHeader from '@/components/StoreHeader'
import StoreFooter from '@/components/StoreFooter'
import { resolveStoreId } from '@/lib/store-id'
import { loadStoreConfig } from '@/lib/store-config'

export function generateMetadata(): Metadata {
  const storeId = resolveStoreId()
  const config = loadStoreConfig(storeId)
  return {
    title: `Quem Somos — ${config.nome}`,
    description: `Conheça a ${config.nome}.`,
  }
}

export default function SobrePage() {
  const storeId = resolveStoreId()
  const config = loadStoreConfig(storeId)
  const waNumber = config.contato?.whatsapp ?? ''

  return (
    <>
      <StoreHeader />
      <main style={{ background: 'var(--cream)', minHeight: '60vh', padding: '60px 6%' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h1 style={h1}>Quem Somos</h1>

          <p style={p}>
            A {config.nome} nasceu da paixão pela pesca e da vontade de tornar esse
            esporte mais acessível para todo mundo — do iniciante que está montando
            seu primeiro equipamento ao pescador experiente que sabe exatamente o que precisa.
          </p>

          <p style={p}>
            Somos uma loja online de Iperó, SP, especializada em equipamentos de pesca
            com procedência: varas, molinetes, carretilhas, linhas e kits completos
            montados com produtos compatíveis entre si.
          </p>

          <p style={p}>
            Nosso compromisso é simples: entregar o equipamento certo, no preço justo,
            com rapidez.
          </p>

          <div style={{ marginTop: '40px', padding: '28px', background: '#fff',
            border: '1px solid var(--border)', borderRadius: 'var(--r-lg)' }}>
            <p style={{ ...p, marginBottom: '16px', fontWeight: '700',
              color: 'var(--g900)', fontSize: '18px' }}>
              Fale com a gente
            </p>
            <p style={{ ...p, marginBottom: '20px' }}>
              Tem dúvida sobre qual equipamento escolher? Nos chame pelo WhatsApp —
              respondemos rápido.
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

const p: React.CSSProperties = {
  fontSize: '16px', color: 'var(--muted)', lineHeight: '1.75',
  marginBottom: '20px', fontFamily: 'var(--ff-body)',
}

const btnWpp: React.CSSProperties = {
  display: 'inline-block', background: '#25D366', color: '#fff',
  fontWeight: '700', fontSize: '15px', padding: '13px 28px',
  borderRadius: '50px', textDecoration: 'none',
}
