'use client'

import { motion } from 'framer-motion'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

const steps = [
  {
    n: '01',
    title: 'Conta criada em 30 segundos',
    lines: ['Cadastro simples.', 'Email e pronto.'],
  },
  {
    n: '02',
    title: 'Conecte suas integrações',
    lines: ['Bling, MP e ME', 'via OAuth —', 'um clique cada.'],
  },
  {
    n: '03',
    title: 'Loja no ar em minutos',
    lines: ['Endereço próprio,', 'produtos sync,', 'pagamento ativo.'],
  },
]

export default function HowItWorks() {
  return (
    <>
      <style>{`
        .hiw-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
          position: relative;
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
        }
        .hiw-line {
          position: absolute;
          top: 24px;
          left: 10%;
          right: 10%;
          height: 1px;
          background: #2A2A35;
          pointer-events: none;
        }
        .hiw-step {
          padding: 0 32px 0 0;
        }
        .hiw-step:last-child { padding-right: 0; }
        @media (max-width: 640px) {
          .hiw-grid { grid-template-columns: 1fr; gap: 40px; }
          .hiw-line { display: none; }
          .hiw-step { padding: 0; }
        }
      `}</style>

      <section
        id="como-funciona"
        style={{
          background: '#0D0D12',
          padding: '100px 6%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease }}
          style={{
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#5A5A68',
            marginBottom: '64px',
          }}
        >
          Como funciona
        </motion.p>

        <div className="hiw-grid">
          <div className="hiw-line" />

          {steps.map((step, i) => (
            <motion.div
              key={step.n}
              className="hiw-step"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, ease, delay: i * 0.12 }}
            >
              <div style={{
                fontSize: '48px',
                fontWeight: 500,
                color: '#2A2A35',
                lineHeight: 1,
                marginBottom: '16px',
                fontVariantNumeric: 'tabular-nums',
              }}>
                {step.n}
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 500,
                color: '#F5F5F7',
                letterSpacing: '-0.01em',
                lineHeight: 1.3,
                marginBottom: '12px',
              }}>
                {step.title}
              </h3>
              <div>
                {step.lines.map((line) => (
                  <p key={line} style={{ fontSize: '14px', color: '#8E8E9A', lineHeight: 1.7 }}>
                    {line}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  )
}
