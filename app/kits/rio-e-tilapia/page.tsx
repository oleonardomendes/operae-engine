import type { Metadata } from 'next'
import KitDetalhePage from '@/components/KitDetalhePage'
import { kitsDetalhes } from '@/data/kitsDetalhes'

export const metadata: Metadata = {
  title: 'Kit Rio & Tilápia — Tá Pra Pesca',
  description: 'Kit completo para pesca de tilápia no pesqueiro. Molinete SE3000, vara 1,80m e linha inclusa. Frete grátis.',
}

export default function Page() {
  const kit = kitsDetalhes.find(k => k.slug === 'rio-e-tilapia')!
  return <KitDetalhePage kit={kit} />
}
