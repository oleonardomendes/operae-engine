'use client'

import { useEffect, useRef } from 'react'
import { useChat } from 'ai/react'
import type { OAuthAction } from './types'

type Message = ReturnType<typeof useChat>['messages'][number]

const PLATFORM_LABELS: Record<string, string> = {
  bling: 'Bling',
  mercado_pago: 'Mercado Pago',
  melhor_envio: 'Melhor Envio',
}

interface ChatPanelProps {
  messages: Message[]
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: React.FormEvent) => void
  isLoading: boolean
  oauthAction: OAuthAction | null
}

export function ChatPanel({
  messages,
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  oauthAction,
}: ChatPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent)
    }
  }

  return (
    <>
      <style>{`
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 24px 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          scrollbar-width: thin;
          scrollbar-color: #2A2A35 transparent;
        }
        .chat-messages::-webkit-scrollbar { width: 4px; }
        .chat-messages::-webkit-scrollbar-thumb { background: #2A2A35; border-radius: 4px; }
        .msg-assistant {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          max-width: 88%;
        }
        .msg-assistant-text {
          font-size: 14px;
          color: #F5F5F7;
          line-height: 1.65;
          white-space: pre-wrap;
        }
        .msg-user {
          display: flex;
          justify-content: flex-end;
        }
        .msg-user-bubble {
          background: #17171F;
          border: 0.5px solid #2A2A35;
          border-radius: 12px 12px 4px 12px;
          padding: 10px 14px;
          font-size: 14px;
          color: #F5F5F7;
          line-height: 1.6;
          max-width: 80%;
          white-space: pre-wrap;
        }
        .dots-wrap {
          display: flex;
          gap: 4px;
          align-items: center;
          padding: 4px 0;
        }
        .dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #5A5A68;
          animation: dot-pulse 1.2s ease-in-out infinite;
        }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes dot-pulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.9); }
          40% { opacity: 1; transform: scale(1); }
        }
        .oauth-btn {
          margin-top: 10px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          font-size: 13px;
          font-weight: 500;
          color: #7C5CFC;
          border: 0.5px solid #7C5CFC;
          border-radius: 8px;
          background: transparent;
          cursor: pointer;
          transition: background 150ms ease, color 150ms ease;
          text-decoration: none;
        }
        .oauth-btn:hover {
          background: #7C5CFC;
          color: #fff;
        }
        .chat-form {
          padding: 16px 20px;
          border-top: 0.5px solid #2A2A35;
          flex-shrink: 0;
        }
        .chat-input-wrap {
          display: flex;
          align-items: flex-end;
          gap: 10px;
          background: #17171F;
          border: 0.5px solid #2A2A35;
          border-radius: 12px;
          padding: 10px 12px;
          transition: border-color 150ms;
        }
        .chat-input-wrap:focus-within {
          border-color: #7C5CFC;
        }
        .chat-textarea {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          resize: none;
          font-size: 14px;
          color: #F5F5F7;
          font-family: var(--font-sans, system-ui, sans-serif);
          line-height: 1.5;
          min-height: 20px;
          max-height: 120px;
          overflow-y: auto;
        }
        .chat-textarea::placeholder { color: #5A5A68; }
        .chat-send {
          width: 32px;
          height: 32px;
          background: #7C5CFC;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 150ms ease;
          flex-shrink: 0;
        }
        .chat-send:hover { background: #9070FD; }
        .chat-send:disabled { opacity: 0.4; cursor: not-allowed; }
      `}</style>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id}>
            {msg.role === 'assistant' ? (
              <div className="msg-assistant">
                <p className="msg-assistant-text">{msg.content}</p>
                {oauthAction && msg === messages[messages.length - 1] && (
                  <a
                    href={oauthAction.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="oauth-btn"
                  >
                    → Conectar {PLATFORM_LABELS[oauthAction.plataforma] ?? oauthAction.plataforma}
                  </a>
                )}
              </div>
            ) : msg.role === 'user' ? (
              <div className="msg-user">
                <div className="msg-user-bubble">{msg.content}</div>
              </div>
            ) : null}
          </div>
        ))}

        {isLoading && (
          <div className="msg-assistant">
            <div className="dots-wrap">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="chat-form">
        <div className="chat-input-wrap">
          <textarea
            ref={textareaRef}
            className="chat-textarea"
            placeholder="Digite sua resposta..."
            value={input}
            onChange={handleInputChange}
            onKeyDown={onKeyDown}
            rows={1}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="chat-send"
            disabled={isLoading || !input.trim()}
            aria-label="Enviar"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 7h12M7 1l6 6-6 6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </form>
    </>
  )
}
