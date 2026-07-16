'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    restaurantName: '',
    firstName: '',
    lastName: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      // TODO: Replace with actual API call
      console.log('Registration attempt:', formData)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (err) {
      setError('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark to-[#0F0F1E] flex items-center justify-center p-4">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Register Card */}
      <div className="relative w-full max-w-lg">
        <div className="bg-card border border-muted rounded-2xl shadow-2xl p-8 animate-slideInUp">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-[#095B63] rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-4xl">🍽️</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-center text-primary mb-2">Create Account</h1>
          <p className="text-center text-secondary text-sm mb-8">Join HBOS today and streamline your restaurant</p>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-brand-error/10 border border-brand-error/30 rounded-lg">
              <p className="text-brand-error text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Restaurant Info */}
            <div>
              <p className="text-primary font-semibold text-sm mb-3">Restaurant Information</p>
              <Input
                label="Restaurant Name"
                name="restaurantName"
                placeholder="Your Restaurant"
                value={formData.restaurantName}
                onChange={handleChange}
                icon="🏪"
                required
              />
            </div>

            {/* Personal Info */}
            <div>
              <p className="text-primary font-semibold text-sm mb-3">Your Information</p>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="First Name"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Account Info */}
            <div>
              <p className="text-primary font-semibold text-sm mb-3">Account Details</p>
              <Input
                label="Email Address"
                type="email"
                name="email"
                placeholder="manager@restaurant.com"
                value={formData.email}
                onChange={handleChange}
                icon="📧"
                required
              />

              <div className="grid grid-cols-2 gap-3 mt-3">
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  icon="🔐"
                  required
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  icon="🔐"
                  required
                />
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-brand-primary mt-1 cursor-pointer" required />
              <span className="text-secondary text-xs">
                I agree to the Terms of Service and Privacy Policy
              </span>
            </label>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-6"
            >
              Create Account
            </Button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-secondary text-sm mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-brand-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-secondary text-xs mt-6">
          Sign up for a 14-day free trial. No credit card required.
        </p>
      </div>
    </div>
  )
}
