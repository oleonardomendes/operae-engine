import type { Metadata } from 'next'
import StoreHeader from '@/components/StoreHeader'
import StoreFooter from '@/components/StoreFooter'
import { resolveStoreId } from '@/lib/store-id'
import { loadStoreConfig } from '@/lib/store-config'

export function generateMetadata(): Metadata {
  const storeId = resolveStoreId()
  const config = loadStoreConfig(storeId)
  return {
    title: `Trocas e Devoluções — ${config.nome}`,
    description: `Política de trocas e devoluções da ${config.nome}.`,
  }
}

export default function TrocasPage() {
  const storeId = resolveStoreId()
  const config = loadStoreConfig(storeId)
  const waNumber = config.contato?.whatsapp ?? ''
  const email = config.contato?.email ?? ''

  return (
    <>
      <StoreHeader />
      <main style={{ background: 'var(--cream)', minHeight: '60vh', padding: '60px 6%' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h1 style={h1}>Trocas e Devoluções</h1>

          <h2 style={h2}>Direito de arrependimento (CDC)</h2>
          <p style={p}>
            De acordo com o Código de Defesa do Consumidor, você tem até 7 dias corridos
            após o recebimento do produto para solicitar a devolução por qualquer motivo,
            sem precisar justificar. Para solicitar, entre em contato pelo WhatsApp ou
            e-mail dentro desse prazo. O produto deve ser devolvido em sua embalagem
            original, sem sinais de uso.
          </p>

          <h2 style={h2}>Defeito de fábrica</h2>
          <p style={p}>
            Se o produto apresentar defeito de fabricação, entre em contato conosco
            pelo WhatsApp ou e-mail com:
          </p>
          <ul style={ul}>
            <li style={li}>Número do pedido</li>
            <li style={li}>Descrição do problema</li>
            <li style={li}>Foto ou vídeo mostrando o defeito</li>
          </ul>
          <p style={p}>
            Avaliaremos o caso e, confirmado o defeito, providenciaremos a troca ou
            reembolso sem custo para você.
          </p>

          <h2 style={h2}>Como solicitar</h2>
          <ul style={ul}>
            {waNumber && <li style={li}><strong>WhatsApp:</strong> {waNumber}</li>}
            {email && <li style={li}><strong>E-mail:</strong> {email}</li>}
            <li style={li}><strong>Horário de atendimento:</strong> Segunda a sexta, das 9h às 18h</li>
            <li style={li}>Respondemos em até 1 dia útil.</li>
          </ul>

          <h2 style={h2}>Reembolso</h2>
          <p style={p}>
            Após a aprovação da devolução, o reembolso é processado em até 5 dias úteis
            no mesmo método de pagamento utilizado na compra.
          </p>

          {waNumber && (
            <div style={{ marginTop: '40px', padding: '28px', background: '#fff',
              border: '1px solid var(--border)', borderRadius: 'var(--r-lg)' }}>
              <p style={{ ...p, marginBottom: '20px' }}>
                Tem dúvida ou precisa iniciar uma troca? Fale diretamente com a gente.
              </p>
              <a
                href={`https://wa.me/${waNumber}`}
                target="_blank" rel="noopener noreferrer"
                style={btnWpp}
              >
                Falar no WhatsApp →
              </a>
            </div>
          )}
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
  marginBottom: '20px', fontFamily: 'var(--ff-body)',
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
