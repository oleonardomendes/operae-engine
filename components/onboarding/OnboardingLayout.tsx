'use client'

import { useChat } from 'ai/react'
import { useMemo } from 'react'
import { ChatPanel } from './ChatPanel'
import { CockpitPanel } from './CockpitPanel'
import type { OAuthAction, StoreInfo, IntegrationStatus } from './types'

export function OnboardingLayout() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Olá! Vamos criar sua loja juntos. Qual será o nome da sua loja?',
      },
    ],
  })

  // Extract state from tool results across all messages
  const storeInfo = useMemo<StoreInfo | null>(() => {
    for (const msg of messages) {
      for (const inv of msg.toolInvocations ?? []) {
        if (inv.toolName === 'criar_loja' && inv.state === 'result') {
          const r = inv.result as Record<string, unknown>
          if (r?.sucesso) {
            return {
              nome: r.nome as string,
              segmento: r.segmento as string,
              regime: r.regime as string,
              store_id: r.store_id as string,
            }
          }
        }
      }
    }
    return null
  }, [messages])

  const integrations = useMemo<IntegrationStatus>(() => {
    const status: IntegrationStatus = { bling: false, mercado_pago: false, melhor_envio: false }
    for (const msg of messages) {
      for (const inv of msg.toolInvocations ?? []) {
        if (inv.toolName === 'verificar_integracao' && inv.state === 'result') {
          const r = inv.result as Record<string, unknown>
          if (r?.conectado) {
            const plat = r.plataforma as keyof IntegrationStatus
            if (plat in status) status[plat] = true
          }
        }
      }
    }
    return status
  }, [messages])

  const oauthAction = useMemo<OAuthAction | null>(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      for (const inv of messages[i].toolInvocations ?? []) {
        if (inv.toolName === 'iniciar_oauth' && inv.state === 'result') {
          const r = inv.result as Record<string, unknown>
          if (r?.sucesso) {
            return {
              url: r.url as string,
              plataforma: r.plataforma as string,
            }
          }
        }
      }
    }
    return null
  }, [messages])

  const step = useMemo(() => {
    let s = 1
    let blingOauth = false
    let mpOauth = false
    let meOauth = false
    let enderecoSalvo = false
    let finalizado = false

    for (const msg of messages) {
      for (const inv of msg.toolInvocations ?? []) {
        if (inv.state !== 'result') continue
        const r = inv.result as Record<string, unknown>
        if (inv.toolName === 'iniciar_oauth' && r?.sucesso) {
          const plat = r.plataforma as string
          if (plat === 'bling') blingOauth = true
          else if (plat === 'mercado_pago') mpOauth = true
          else if (plat === 'melhor_envio') meOauth = true
        }
        if (inv.toolName === 'salvar_endereco' && r?.sucesso) enderecoSalvo = true
        if (inv.toolName === 'finalizar_onboarding' && r?.sucesso) finalizado = true
      }
    }

    if (storeInfo) s = 2
    if (blingOauth) s = 3
    if (mpOauth) s = 4
    if (meOauth) s = 5
    if (enderecoSalvo || finalizado) s = 6
    return s
  }, [messages, storeInfo])

  return (
    <>
      <style>{`
        .ob-root {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: #0D0D12;
          font-family: var(--font-sans, system-ui, sans-serif);
        }
        .ob-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          height: 52px;
          border-bottom: 0.5px solid #2A2A35;
          flex-shrink: 0;
        }
        .ob-body {
          display: flex;
          flex: 1;
          overflow: hidden;
        }
        .ob-chat {
          width: 40%;
          border-right: 0.5px solid #2A2A35;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .ob-cockpit {
          flex: 1;
          overflow-y: auto;
        }
        @media (max-width: 768px) {
          .ob-body { flex-direction: column; }
          .ob-chat { width: 100%; border-right: none; border-bottom: 0.5px solid #2A2A35; height: 55vh; }
          .ob-cockpit { height: 45vh; }
        }
      `}</style>

      <div className="ob-root">
        <header className="ob-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '15px', fontWeight: 500, color: '#F5F5F7' }}>Guiamos</span>
            <span style={{ color: '#7C5CFC', fontSize: '12px' }}>✦</span>
          </div>
          <span style={{ fontSize: '13px', color: '#5A5A68' }}>
            Passo {step} de 6
          </span>
        </header>

        <div className="ob-body">
          <div className="ob-chat">
            <ChatPanel
              messages={messages}
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              oauthAction={oauthAction}
            />
          </div>
          <div className="ob-cockpit">
            <CockpitPanel
              step={step}
              storeInfo={storeInfo}
              integrations={integrations}
            />
          </div>
        </div>
      </div>
    </>
  )
}
