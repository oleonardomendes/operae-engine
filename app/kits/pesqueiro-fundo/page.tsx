import type { Metadata } from 'next'
import KitDetalhePage from '@/components/KitDetalhePage'
import { kitsDetalhes } from '@/data/kitsDetalhes'

export const metadata: Metadata = {
  title: 'Kit Pesqueiro Fundo — Tá Pra Pesca',
  description: 'Kit para pesca de fundo com pacu e tambaqui. Molinete FB6000, vara 2,10m, linha 500m e chumbada inclusa. Frete grátis.',
}

export default function Page() {
  const kit = kitsDetalhes.find(k => k.slug === 'pesqueiro-fundo')!
  return <KitDetalhePage kit={kit} />
}
