'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomeHashRedirect() {
  const router = useRouter()

  useEffect(() => {
    const hash = window.location.hash
    if (hash.includes('type=invite') ||
        (hash.includes('access_token') && hash.includes('type=invite'))) {
      router.replace('/criar-senha' + hash)
    }
  }, [])

  return null
}
