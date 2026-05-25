'use client'

import { useState } from 'react'

interface FreteOpcao {
  id: number
  nome: string
  empresa: string
  preco: number
  prazo: number
  logo: string
}

interface Props {
  produtos: Array<{
    id: string
    nome: string
    peso: number
    altura: number
    largura: number
    comprimento: number
    valor: number
    quantidade: number
  }>
}

function mascaraCEP(v: string) {
  return v.replace(/\D/g, '').slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2')
}

const fmt = (n: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n)

export default function FreteCalculador({ produtos }: Props) {
  const [cep, setCep] = useState('')
  const [opcoes, setOpcoes] = useState<FreteOpcao[]>([])
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [calculado, setCalculado] = useState(false)

  async function calcular() {
    const digits = cep.replace(/\D/g, '')
    if (digits.length !== 8) { setErro('CEP inválido'); return }
    setErro('')
    setLoading(true)
    setOpcoes([])
    setCalculado(false)
    try {
      const res = await fetch('/api/shipping/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cepDestino: digits, produtos }),
      })
      const data = await res.json()
      if (data.opcoes?.length) {
        setOpcoes(data.opcoes)
        setCalculado(true)
      } else {
        setErro('Não foi possível calcular o frete para este CEP.')
      }
    } catch {
      setErro('Erro ao calcular. Tente novamente.')
    }
    setLoading(false)
  }

  return (
    <div style={{
      borderTop: '1px solid var(--border)',
      paddingTop: '16px',
    }}>
      <p style={{
        fontSize: '12px', fontWeight: '700', color: 'var(--g900)',
        textTransform: 'uppercase', letterSpacing: '.09em', marginBottom: '10px',
      }}>
        Calcular frete
      </p>

      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          placeholder="00000-000"
          value={cep}
          onChange={e => setCep(mascaraCEP(e.target.value))}
          inputMode="numeric"
          onKeyDown={e => e.key === 'Enter' && calcular()}
          style={{
            flex: 1, border: '1.5px solid var(--border)',
            borderRadius: '50px', padding: '10px 16px',
            fontSize: '14px', fontFamily: 'var(--ff-body)',
            outline: 'none', color: 'var(--dark)',
          }}
        />
        <button
          onClick={calcular}
          disabled={loading}
          style={{
            background: 'var(--g700)', color: '#fff',
            border: 'none', borderRadius: '50px',
            padding: '10px 20px', fontFamily: 'var(--ff-body)',
            fontSize: '13px', fontWeight: '700',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            whiteSpace: 'nowrap',
          }}
        >
          {loading ? '...' : 'Calcular'}
        </button>
      </div>

      {erro && (
        <p style={{ fontSize: '12px', color: '#A32D2D', marginTop: '8px' }}>{erro}</p>
      )}

      {calculado && opcoes.length > 0 && (
        <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {opcoes.map(op => (
            <div key={op.id} style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', padding: '10px 14px',
              border: '1px solid var(--border)', borderRadius: '10px',
              background: '#fff',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {op.logo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={op.logo} alt={op.empresa}
                    style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
                )}
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--dark)' }}>
                    {op.nome}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                    {op.prazo} dias úteis
                  </div>
                </div>
              </div>
              <span style={{
                fontSize: '16px', fontWeight: '700',
                color: 'var(--g700)', fontFamily: 'var(--ff-display)',
              }}>
                {fmt(op.preco)}
              </span>
            </div>
          ))}
          <p style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>
            * Prazo a partir da confirmação do pagamento.{' '}
            <a
              href="https://buscacepinter.correios.com.br/app/endereco/index.php"
              target="_blank" rel="noopener noreferrer"
              style={{ color: 'var(--g500)' }}
            >
              Não sei meu CEP
            </a>
          </p>
        </div>
      )}
    </div>
  )
}
