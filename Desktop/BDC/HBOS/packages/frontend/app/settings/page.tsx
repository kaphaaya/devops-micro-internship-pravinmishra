'use client'

import React from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card } from '@/components/common/Card'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'

export default function SettingsPage() {
  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">Settings</h1>
        <p className="text-secondary">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <nav className="space-y-2">
              {[
                { label: 'Profile', icon: '👤' },
                { label: 'Restaurant', icon: '🏪' },
                { label: 'Users', icon: '👥' },
                { label: 'Billing', icon: '💳' },
                { label: 'Preferences', icon: '⚙️' },
              ].map((item) => (
                <button
                  key={item.label}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-brand-primary hover:text-white transition-all duration-fast"
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <Card>
            <h2 className="text-2xl font-bold text-primary mb-6">Profile Settings</h2>
            <div className="space-y-4">
              <Input label="Full Name" placeholder="John Doe" icon="👤" />
              <Input label="Email" type="email" placeholder="john@restaurant.com" icon="📧" />
              <Input label="Phone" type="tel" placeholder="+1 (555) 123-4567" icon="📞" />
            </div>
            <Button variant="primary" className="mt-6">
              Save Changes
            </Button>
          </Card>

          {/* Danger Zone */}
          <Card className="border-l-4 border-l-brand-error">
            <h2 className="text-2xl font-bold text-brand-error mb-4">Danger Zone</h2>
            <p className="text-secondary mb-4">These actions cannot be undone.</p>
            <div className="space-y-3">
              <Button variant="warning" className="w-full justify-start">
                🔑 Change Password
              </Button>
              <Button variant="error" className="w-full justify-start">
                🗑️ Delete Account
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
