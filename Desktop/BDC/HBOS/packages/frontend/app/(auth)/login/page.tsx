'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // TODO: Replace with actual API call
      console.log('Login attempt:', { email, password })

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (err) {
      setError('Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark to-[#0F0F1E] flex items-center justify-center p-4">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-card border border-muted rounded-2xl shadow-2xl p-8 animate-slideInUp">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-[#095B63] rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-4xl">🍽️</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-center text-primary mb-2">HBOS</h1>
          <p className="text-center text-secondary text-sm mb-8">Restaurant Operating System</p>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-brand-error/10 border border-brand-error/30 rounded-lg">
              <p className="text-brand-error text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="manager@restaurant.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon="📧"
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon="🔐"
              required
            />

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-brand-primary cursor-pointer"
                />
                <span className="text-secondary">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-brand-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-6"
            >
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-muted" />
            <span className="text-secondary text-sm">or</span>
            <div className="flex-1 h-px bg-muted" />
          </div>

          {/* Demo Credentials */}
          <div className="p-4 bg-[#374151]/50 rounded-lg mb-6">
            <p className="text-secondary text-xs mb-2 font-medium">Demo Credentials:</p>
            <p className="text-primary text-sm font-mono mb-1">manager@demo.com</p>
            <p className="text-secondary text-sm font-mono">password123</p>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-secondary text-sm">
            Don't have an account?{' '}
            <Link href="/register" className="text-brand-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-secondary text-xs mt-6">
          By signing in, you agree to our Terms of Service
        </p>
      </div>
    </div>
  )
}
