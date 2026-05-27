import type { Metadata } from 'next'
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout'

export const metadata: Metadata = {
  title: 'Criar minha loja — Guiamos',
}

export default function OnboardingPage() {
  return <OnboardingLayout />
}
