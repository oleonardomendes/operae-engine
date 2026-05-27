'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

const integrations = [
  {
    icon: '✓',
    name: 'Bling ERP',
    desc: '247 produtos sync',
    connected: true,
  },
  {
    icon: '✓',
    name: 'Mercado Pago',
    desc: 'PIX + Cartão',
    connected: true,
  },
  {
    icon: '◎',
    name: 'Melhor Envio',
    desc: 'Frete automático',
    connected: false,
  },
]

export default function Hero() {
  return (
    <>
      <style>{`
        .hero-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          width: 100%;
        }
        .hero-btns {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 56px;
        }
        .hero-btn-primary {
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 500;
          color: #fff;
          background: #7C5CFC;
          border-radius: 8px;
          border: none;
          text-decoration: none;
          display: inline-block;
          transition: background 150ms ease;
          cursor: pointer;
        }
        .hero-btn-primary:hover { background: #9070FD; }
        .hero-btn-ghost {
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 500;
          color: #8E8E9A;
          background: transparent;
          border-radius: 8px;
          border: 0.5px solid #2A2A35;
          text-decoration: none;
          display: inline-block;
          transition: color 150ms ease, border-color 150ms ease;
          cursor: pointer;
        }
        .hero-btn-ghost:hover { color: #F5F5F7; border-color: #3A3A48; }
        @media (max-width: 640px) {
          .hero-cards { grid-template-columns: 1fr; }
        }
      `}</style>

      <section style={{
        minHeight: '100vh',
        background: '#0D0D12',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '112px 6% 80px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '760px', width: '100%' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease }}
            style={{
              display: 'inline-block',
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#7C5CFC',
              marginBottom: '24px',
            }}
          >
            Plataforma de E-commerce IA
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease, delay: 0.1 }}
            style={{
              fontSize: 'clamp(40px, 6vw, 72px)',
              fontWeight: 500,
              letterSpacing: '-0.03em',
              color: '#F5F5F7',
              lineHeight: 1.1,
              marginBottom: '24px',
              fontFamily: 'var(--font-serif)',
            }}
          >
            Sua loja pronta.
            <br />
            De uma{' '}
            <span style={{ color: '#7C5CFC' }}>conversa.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease, delay: 0.2 }}
            style={{
              fontSize: '18px',
              color: '#8E8E9A',
              lineHeight: 1.7,
              maxWidth: '480px',
              margin: '0 auto 40px',
            }}
          >
            Conecte seu Bling, Mercado Pago e Melhor Envio.
            <br />
            A IA configura tudo. Você só conversa.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease, delay: 0.3 }}
            className="hero-btns"
          >
            <Link href="/login?register=true" className="hero-btn-primary">
              Criar minha loja —→
            </Link>
            <a href="#como-funciona" className="hero-btn-ghost">
              Ver como funciona
            </a>
          </motion.div>

          <motion.div
            className="hero-cards"
            initial="initial"
            animate="animate"
            variants={{
              animate: {
                transition: { staggerChildren: 0.1, delayChildren: 0.55 },
              },
            }}
          >
            {integrations.map((item) => (
              <motion.div
                key={item.name}
                variants={{
                  initial: { scale: 0.96, opacity: 0 },
                  animate: {
                    scale: 1,
                    opacity: 1,
                    transition: { type: 'spring', stiffness: 300, damping: 24 },
                  },
                }}
                style={{
                  background: '#17171F',
                  border: '0.5px solid #2A2A35',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  textAlign: 'left',
                }}
              >
                <div style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: item.connected ? '#1D9E75' : '#EF9F27',
                  marginBottom: '6px',
                }}>
                  {item.icon}
                </div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#F5F5F7',
                  marginBottom: '2px',
                }}>
                  {item.name}
                </div>
                <div style={{ fontSize: '12px', color: '#8E8E9A' }}>
                  {item.desc}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  )
}
