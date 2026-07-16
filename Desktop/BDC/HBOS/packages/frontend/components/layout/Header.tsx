'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

interface HeaderProps {
  onMenuToggle?: () => void
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState<string>('')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))

    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-muted z-40">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Menu Button - Mobile */}
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 hover:bg-[#374151] rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-[#095B63] rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold text-white">🍽️</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-lg font-bold text-primary">HBOS</p>
              <p className="text-xs text-secondary">Restaurant OS</p>
            </div>
          </Link>
        </div>

        {/* Center - Time & Status */}
        <div className="hidden md:flex items-center gap-6">
          <div className="text-right">
            <p className="text-sm font-medium text-primary">{isMounted ? currentTime : '--:-- --'}</p>
            <p className="text-xs text-secondary">Live</p>
          </div>
          <div className="w-2 h-2 bg-brand-success rounded-full animate-pulse" />
        </div>

        {/* Right - User Profile */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#374151] transition-all duration-fast"
          >
            <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
              JD
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-primary">John Doe</p>
              <p className="text-xs text-secondary">Manager</p>
            </div>
            <svg className={`w-4 h-4 text-secondary transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24">
              <path fill="currentColor" d="M7 10l5 5 5-5z" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-card border border-muted rounded-lg shadow-lg z-50 animate-slideInDown">
              <a
                href="/settings"
                className="block px-4 py-2 text-secondary hover:text-primary hover:bg-[#374151] rounded-t-lg"
              >
                Profile Settings
              </a>
              <a
                href="/settings"
                className="block px-4 py-2 text-secondary hover:text-primary hover:bg-[#374151]"
              >
                Preferences
              </a>
              <hr className="border-muted my-2" />
              <button
                onClick={() => {
                  // Logout logic
                  setIsProfileOpen(false)
                }}
                className="w-full text-left px-4 py-2 text-brand-error hover:bg-brand-error/10 rounded-b-lg"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
