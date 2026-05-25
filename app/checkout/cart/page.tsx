'use client'

import { useCart } from '@/contexts/CartContext'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { trackBeginCheckout } from '@/lib/analytics'
import nextDynamic from 'next/dynamic'
import { dimensoesProdutos, dimensoesPadrao } from '@/data/dimensoes'
import StoreHeader from '@/components/StoreHeader'
import Link from 'next/link'

const CheckoutForm = nextDynamic(
  () => import('@/components/CheckoutForm'),
  { ssr: false }
)

export default function CartCheckoutPage() {
  const { items, totalPreco } = useCart()
  const router = useRouter()

  useEffect(() => {
    if (items.length === 0) {
      router.replace('/')
      return
    }

    trackBeginCheckout(
      totalPreco,
      items.map(i => ({ item_id: String(i.id), item_name: i.nome, price: i.preco, quantity: i.quantidade }))
    )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (items.length === 0) return null

  return (
    <>
      <StoreHeader />
      <div style={{ minHeight: '100vh', background: 'var(--cream)', padding: '40px 5%' }}>
        <Link href="/" style={{ color: 'var(--muted)', fontSize: '14px',
          fontWeight: '500', display: 'inline-flex', alignItems: 'center',
          gap: '6px', marginBottom: '32px' }}>
          ← Continuar comprando
        </Link>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <CheckoutForm
            kitNome={
              items.length === 1
                ? items[0].nome
                : `${items.length} produtos`
            }
            kitPreco={totalPreco}
            backUrls={{
              success: 'https://taprapesca.com.br/obrigado',
              failure: 'https://taprapesca.com.br',
              pending: 'https://taprapesca.com.br/obrigado',
            }}
            produtosParaFrete={items.map(i => {
              const codigo = String(i.id)
              const dimensoes = dimensoesProdutos[codigo] ?? dimensoesPadrao
              return {
                id: String(i.id),
                codigo,
                nome: i.nome,
                valor: i.preco,
                quantidade: i.quantidade,
                ...dimensoes,
              }
            })}
            onEnderecoComplete={(dados) => {
              sessionStorage.setItem('checkout_dados', JSON.stringify(dados))
            }}
            onFreteSelected={() => {}}
          />
        </div>
      </div>
    </>
  )
}
