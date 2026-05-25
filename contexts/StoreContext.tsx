'use client'

import { createContext, useContext } from 'react'
import type { StoreConfig } from '@/lib/store-config'

const StoreContext = createContext<StoreConfig | null>(null)

export function StoreProvider({
  config,
  children,
}: {
  config: StoreConfig
  children: React.ReactNode
}) {
  return (
    <StoreContext.Provider value={config}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore(): StoreConfig {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore deve ser usado dentro de <StoreProvider>')
  return ctx
}
