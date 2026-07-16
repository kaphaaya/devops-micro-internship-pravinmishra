'use client'

import React from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

interface MainLayoutProps {
  children: React.ReactNode
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="bg-dark text-primary min-h-screen">
      <Header />
      <Sidebar />

      {/* Main Content */}
      <main className="pt-20 pl-20 md:pl-64 transition-all duration-fast">
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
