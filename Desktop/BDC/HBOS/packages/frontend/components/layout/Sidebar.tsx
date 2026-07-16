'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigationItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: '📊',
    section: 'main',
  },
  {
    label: 'POS',
    href: '/pos',
    icon: '🛒',
    section: 'main',
  },
  {
    label: 'Orders',
    href: '/dashboard/orders',
    icon: '📋',
    section: 'management',
  },
  {
    label: 'Inventory',
    href: '/dashboard/inventory',
    icon: '📦',
    section: 'management',
  },
  {
    label: 'Customers',
    href: '/dashboard/customers',
    icon: '👥',
    section: 'management',
  },
  {
    label: 'Products',
    href: '/dashboard/products',
    icon: '🍽️',
    section: 'management',
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: '⚙️',
    section: 'admin',
  },
]

export const Sidebar: React.FC = () => {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const sections = {
    main: 'Main',
    management: 'Management',
    admin: 'Admin',
  }

  const groupedItems = navigationItems.reduce(
    (acc, item) => {
      if (!acc[item.section]) acc[item.section] = []
      acc[item.section].push(item)
      return acc
    },
    {} as Record<string, typeof navigationItems>,
  )

  return (
    <div
      className={`
        fixed left-0 top-16 bottom-0 bg-card border-r border-muted
        transition-all duration-fast z-40
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-4 bg-brand-primary text-white rounded-full p-1 hover:bg-[#095B63]"
      >
        {isCollapsed ? '→' : '←'}
      </button>

      {/* Navigation */}
      <nav className="pt-6 px-3 space-y-6 overflow-y-auto h-full pb-20">
        {Object.entries(groupedItems).map(([section, items]) => (
          <div key={section}>
            {!isCollapsed && (
              <p className="text-secondary text-xs font-bold px-3 mb-3 uppercase tracking-wide">
                {sections[section as keyof typeof sections]}
              </p>
            )}
            <ul className="space-y-2">
              {items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-lg
                        transition-all duration-fast
                        ${
                          isActive
                            ? 'bg-brand-primary text-white shadow-glow'
                            : 'text-secondary hover:bg-[#374151] hover:text-primary'
                        }
                      `}
                      title={isCollapsed ? item.label : ''}
                    >
                      <span className="text-xl">{item.icon}</span>
                      {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  )
}
