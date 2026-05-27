const features = [
  'ERP — Bling sincronizado',
  'Pagamento — PIX + Cartão',
  'Frete — Melhor Envio',
  'Pixels — Meta, TikTok, GA4',
  'Feed — Google Shopping + Meta',
  'Email — Transacional',
  'Domínio — Subdomínio próprio',
  'SSL — HTTPS automático',
]

export default function WhatIsIncluded() {
  return (
    <section style={{
      background: '#0D0D12',
      padding: '100px 6%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <p style={{
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: '#5A5A68',
        marginBottom: '16px',
      }}>
        Tudo que você precisa
      </p>

      <h2 style={{
        fontSize: 'clamp(24px, 4vw, 40px)',
        fontWeight: 500,
        letterSpacing: '-0.02em',
        color: '#F5F5F7',
        textAlign: 'center',
        lineHeight: 1.2,
        marginBottom: '12px',
        maxWidth: '560px',
      }}>
        Outros cobram por cada peça.
      </h2>
      <p style={{
        fontSize: '18px',
        color: '#8E8E9A',
        textAlign: 'center',
        marginBottom: '48px',
      }}>
        O Guiamos entrega tudo junto.
      </p>

      <div style={{
        background: '#17171F',
        border: '0.5px solid #2A2A35',
        borderRadius: '16px',
        padding: '32px 40px',
        width: '100%',
        maxWidth: '520px',
      }}>
        {features.map((feature) => (
          <div
            key={feature}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 0',
              borderBottom: '0.5px solid #2A2A35',
            }}
          >
            <span style={{ color: '#1D9E75', fontSize: '14px', fontWeight: 600, flexShrink: 0 }}>
              ✓
            </span>
            <span style={{ fontSize: '14px', color: '#F5F5F7' }}>{feature}</span>
          </div>
        ))}

        <p style={{
          fontSize: '14px',
          color: '#7C5CFC',
          fontWeight: 500,
          textAlign: 'center',
          marginTop: '20px',
        }}>
          Tudo isso via conversa. Sem formulários.
        </p>
      </div>
    </section>
  )
}
