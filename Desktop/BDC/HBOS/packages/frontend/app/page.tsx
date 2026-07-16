'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.push('/dashboard')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-dark">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-[#095B63] rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4">
          <span className="text-4xl">🍽️</span>
        </div>
        <h1 className="text-4xl font-bold mb-4 text-primary">HBOS</h1>
        <p className="text-lg text-secondary">
          Redirecting to dashboard...
        </p>
      </div>
    </div>
  )
}
