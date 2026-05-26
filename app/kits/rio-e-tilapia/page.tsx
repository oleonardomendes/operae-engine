import type { Metadata } from 'next'
import KitDetalhePage from '@/components/KitDetalhePage'
import { kitsDetalhes } from '@/data/kitsDetalhes'
import { resolveStoreId } from '@/lib/store-id'
import { loadStoreConfig } from '@/lib/store-config'

export async function generateMetadata(): Promise<Metadata> {
  const storeId = await resolveStoreId()
  const config = loadStoreConfig(storeId)
  return {
    title: `Kit Rio & Tilápia — ${config.nome}`,
    description: 'Kit completo para pesca de tilápia no pesqueiro. Molinete SE3000, vara 1,80m e linha inclusa. Frete grátis.',
  }
}

export default function Page() {
  const kit = kitsDetalhes.find(k => k.slug === 'rio-e-tilapia')!
  return <KitDetalhePage kit={kit} />
}
