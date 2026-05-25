import type { Metadata } from 'next'
import StoreHeader from '@/components/StoreHeader'
import StoreFooter from '@/components/StoreFooter'

export const metadata: Metadata = {
  title: 'Política de Privacidade — Tá Pra Pesca',
  description: 'Política de privacidade e proteção de dados da Tá Pra Pesca (LGPD).',
}

export default function PrivacidadePage() {
  return (
    <>
      <StoreHeader />
      <main style={{ background: 'var(--cream)', minHeight: '60vh', padding: '60px 6%' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h1 style={h1}>Política de Privacidade</h1>

          <h2 style={h2}>Quais dados coletamos</h2>
          <ul style={ul}>
            <li style={li}><strong>Dados de cadastro:</strong> nome, e-mail, CPF, endereço e telefone</li>
            <li style={li}><strong>Dados de navegação:</strong> páginas visitadas, tempo de navegação</li>
            <li style={li}><strong>Dados de pagamento:</strong> processados pelo gateway — não armazenamos dados de cartão</li>
          </ul>

          <h2 style={h2}>Para que usamos seus dados</h2>
          <ul style={ul}>
            <li style={li}>Processar e entregar seu pedido</li>
            <li style={li}>Enviar atualizações sobre o status da compra</li>
            <li style={li}>Emitir nota fiscal</li>
            <li style={li}>Melhorar a experiência de navegação</li>
            <li style={li}>Contato em caso de dúvidas sobre o pedido</li>
          </ul>

          <h2 style={h2}>Compartilhamento de dados</h2>
          <p style={p}>
            Não compartilhamos seus dados com terceiros para fins comerciais. Os dados são
            compartilhados somente com parceiros operacionais necessários para a entrega
            (transportadoras e gateway de pagamento).
          </p>

          <h2 style={h2}>Seus direitos</h2>
          <p style={p}>
            Você pode a qualquer momento solicitar: acesso aos seus dados, correção de dados
            incorretos, exclusão dos seus dados ou revogação do consentimento. Para exercer
            esses direitos, entre em contato pelo e-mail:{' '}
            <a href="mailto:contato@taprapesca.com.br" style={linkStyle}>
              contato@taprapesca.com.br
            </a>
          </p>

          <h2 style={h2}>Cookies</h2>
          <p style={p}>
            Utilizamos cookies para melhorar sua experiência de navegação. Você pode
            desativá-los nas configurações do seu navegador, mas isso pode afetar algumas
            funcionalidades do site.
          </p>

          <h2 style={h2}>Contato</h2>
          <ul style={ul}>
            <li style={li}><strong>E-mail:</strong> contato@taprapesca.com.br</li>
            <li style={li}><strong>WhatsApp:</strong> (15) 99617-7133</li>
          </ul>

          <p style={{ ...p, marginTop: '48px', fontSize: '13px', opacity: 0.6 }}>
            Última atualização: Maio de 2025
          </p>
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

const linkStyle: React.CSSProperties = {
  color: 'var(--g500)', textDecoration: 'underline',
}
