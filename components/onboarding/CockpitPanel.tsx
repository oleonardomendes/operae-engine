'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { StoreInfo, IntegrationStatus } from './types'

interface CockpitPanelProps {
  step: number
  storeInfo: StoreInfo | null
  integrations: IntegrationStatus
}

const TOTAL_STEPS = 6

const REGIME_LABELS: Record<string, string> = {
  MEI: 'MEI',
  SN: 'Simples Nacional',
  LP: 'Lucro Presumido',
}

function ProgressArc({ step }: { step: number }) {
  const r = 44
  const cx = 56
  const cy = 56
  const circumference = 2 * Math.PI * r
  const progress = step / TOTAL_STEPS
  const dash = circumference * progress

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <svg width="112" height="112" viewBox="0 0 112 112">
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke="#2A2A35"
          strokeWidth="6"
        />
        <motion.circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke="#7C5CFC"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - dash }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ transform: 'rotate(-90deg)', transformOrigin: `${cx}px ${cy}px` }}
        />
        <text
          x={cx} y={cy - 6}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#F5F5F7"
          fontSize="20"
          fontWeight="500"
          fontFamily="system-ui, sans-serif"
        >
          {step}/{TOTAL_STEPS}
        </text>
        <text
          x={cx} y={cy + 14}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#5A5A68"
          fontSize="10"
          fontFamily="system-ui, sans-serif"
        >
          configurações
        </text>
      </svg>
    </div>
  )
}

interface IntegrationCardProps {
  name: string
  connected: boolean
  pending?: boolean
}

function IntegrationCard({ name, connected, pending }: IntegrationCardProps) {
  const icon = connected ? '✓' : pending ? '⚡' : '○'
  const iconColor = connected ? '#1D9E75' : pending ? '#7C5CFC' : '#5A5A68'
  const statusText = connected ? 'Conectado' : pending ? 'Conectando...' : 'Aguardando conexão'

  return (
    <motion.div
      layout
      initial={{ scale: 0.96, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      style={{
        background: '#17171F',
        border: `0.5px solid ${connected ? '#1D9E7540' : '#2A2A35'}`,
        borderRadius: '12px',
        padding: '16px',
        flex: 1,
        minWidth: 0,
      }}
    >
      <div style={{
        fontSize: '16px',
        fontWeight: 700,
        color: iconColor,
        marginBottom: '6px',
        transition: 'color 300ms ease',
      }}>
        {icon}
      </div>
      <div style={{ fontSize: '13px', fontWeight: 500, color: '#F5F5F7', marginBottom: '2px' }}>
        {name}
      </div>
      <div style={{ fontSize: '12px', color: connected ? '#1D9E75' : '#5A5A68' }}>
        {statusText}
      </div>
    </motion.div>
  )
}

export function CockpitPanel({ step, storeInfo, integrations }: CockpitPanelProps) {
  return (
    <>
      <style>{`
        .cockpit-inner {
          padding: 32px 28px;
          display: flex;
          flex-direction: column;
          gap: 32px;
          min-height: 100%;
        }
        .int-row {
          display: flex;
          gap: 12px;
        }
        @media (max-width: 1024px) {
          .int-row { flex-wrap: wrap; }
          .int-row > * { flex: 1 1 calc(50% - 6px); }
        }
        @media (max-width: 480px) {
          .int-row > * { flex: 1 1 100%; }
        }
      `}</style>

      <div className="cockpit-inner">
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ProgressArc step={step} />
        </div>

        <AnimatePresence>
          {storeInfo && (
            <motion.div
              key="store-info"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: '#17171F',
                border: '0.5px solid #2A2A35',
                borderRadius: '12px',
                padding: '16px 20px',
              }}
            >
              <p style={{ fontSize: '16px', fontWeight: 500, color: '#F5F5F7', marginBottom: '4px' }}>
                {storeInfo.nome}
              </p>
              <p style={{ fontSize: '13px', color: '#8E8E9A' }}>
                {REGIME_LABELS[storeInfo.regime] ?? storeInfo.regime}
                {storeInfo.segmento ? ` · ${storeInfo.segmento}` : ''}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div>
          <p style={{
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#5A5A68',
            marginBottom: '12px',
          }}>
            Integrações
          </p>
          <div className="int-row">
            <IntegrationCard
              name="Bling ERP"
              connected={integrations.bling}
            />
            <IntegrationCard
              name="Mercado Pago"
              connected={integrations.mercado_pago}
            />
            <IntegrationCard
              name="Melhor Envio"
              connected={integrations.melhor_envio}
            />
          </div>
        </div>

        {step < 6 && (
          <div style={{
            background: 'rgba(124, 92, 252, 0.06)',
            border: '0.5px solid rgba(124, 92, 252, 0.2)',
            borderRadius: '12px',
            padding: '14px 18px',
          }}>
            <p style={{ fontSize: '13px', color: '#8E8E9A', lineHeight: 1.6 }}>
              Continue a conversa ao lado para configurar sua loja passo a passo.
            </p>
          </div>
        )}

        {step >= 6 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            style={{
              background: 'rgba(29, 158, 117, 0.08)',
              border: '0.5px solid rgba(29, 158, 117, 0.3)',
              borderRadius: '12px',
              padding: '18px 20px',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: '20px', marginBottom: '6px' }}>✓</p>
            <p style={{ fontSize: '15px', fontWeight: 500, color: '#1D9E75', marginBottom: '4px' }}>
              Loja configurada
            </p>
            <p style={{ fontSize: '13px', color: '#8E8E9A' }}>
              Sua loja está pronta e operacional.
            </p>
          </motion.div>
        )}
      </div>
    </>
  )
}
