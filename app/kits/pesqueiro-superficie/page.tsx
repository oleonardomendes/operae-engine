import type { Metadata } from 'next'
import KitDetalhePage from '@/components/KitDetalhePage'
import { kitsDetalhes } from '@/data/kitsDetalhes'

export const metadata: Metadata = {
  title: 'Kit Pesqueiro Superfície — Tá Pra Pesca',
  description: 'Kit para pesca de superfície com bóia cevadeira. Carretilha SP200, vara de carbono 2,40m, linha 500m e boia inclusa. Frete grátis.',
}

export default function Page() {
  const kit = kitsDetalhes.find(k => k.slug === 'pesqueiro-superficie')!
  return <KitDetalhePage kit={kit} />
}
