import type { Metadata } from 'next'
import KitDetalhePage from '@/components/KitDetalhePage'
import { kitsDetalhes } from '@/data/kitsDetalhes'
import { resolveStoreId } from '@/lib/store-id'
import { loadStoreConfig } from '@/lib/store-config'

export async function generateMetadata(): Promise<Metadata> {
  const storeId = await resolveStoreId()
  const config = loadStoreConfig(storeId)
  return {
    title: `Kit Pesqueiro Superfície — ${config.nome}`,
    description: 'Kit para pesca de superfície com bóia cevadeira. Carretilha SP200, vara de carbono 2,40m, linha 500m e boia inclusa. Frete grátis.',
  }
}

export default function Page() {
  const kit = kitsDetalhes.find(k => k.slug === 'pesqueiro-superficie')!
  return <KitDetalhePage kit={kit} />
}
