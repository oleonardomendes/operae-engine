import type { Metadata } from 'next'
import KitDetalhePage from '@/components/KitDetalhePage'
import { kitsDetalhes } from '@/data/kitsDetalhes'
import { resolveStoreId } from '@/lib/store-id'
import { loadStoreConfig } from '@/lib/store-config'

export function generateMetadata(): Metadata {
  const storeId = resolveStoreId()
  const config = loadStoreConfig(storeId)
  return {
    title: `Kit Pesqueiro Fundo — ${config.nome}`,
    description: 'Kit para pesca de fundo com pacu e tambaqui. Molinete FB6000, vara 2,10m, linha 500m e chumbada inclusa. Frete grátis.',
  }
}

export default function Page() {
  const kit = kitsDetalhes.find(k => k.slug === 'pesqueiro-fundo')!
  return <KitDetalhePage kit={kit} />
}
