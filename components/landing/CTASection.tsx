'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

export default function CTASection() {
  return (
    <>
      <style>{`
        .cta-btn {
          padding: 16px 32px;
          font-size: 15px;
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
        .cta-btn:hover { background: #9070FD; }
      `}</style>

      <section style={{
        background: '#0D0D12',
        padding: '100px 6%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        borderTop: '0.5px solid #2A2A35',
      }}>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease }}
          style={{
            fontSize: '13px',
            color: '#5A5A68',
            fontWeight: 500,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: '24px',
          }}
        >
          Pronto para começar?
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease, delay: 0.08 }}
          style={{
            fontSize: 'clamp(32px, 5vw, 56px)',
            fontWeight: 500,
            letterSpacing: '-0.03em',
            color: '#F5F5F7',
            lineHeight: 1.15,
            marginBottom: '16px',
            fontFamily: 'var(--font-serif)',
          }}
        >
          Crie sua loja agora.
          <br />
          <span style={{ color: '#8E8E9A' }}>Leva menos de 5 minutos.</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease, delay: 0.16 }}
          style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}
        >
          <Link href="/login?register=true" className="cta-btn">
            Criar minha loja gratuitamente →
          </Link>
          <p style={{ fontSize: '13px', color: '#5A5A68' }}>
            Sem cartão de crédito. Sem contrato.
          </p>
        </motion.div>
      </section>
    </>
  )
}
