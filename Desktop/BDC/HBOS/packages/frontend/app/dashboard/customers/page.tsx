'use client'

import React, { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card } from '@/components/common/Card'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  totalOrders: number
  totalSpent: number
  lastVisit: string
  tier: 'regular' | 'vip' | 'new'
  avatar: string
}

const customers: Customer[] = [
  { id: '1', name: 'Maria Garcia', email: 'maria.g@email.com', phone: '+1 555-0101', totalOrders: 24, totalSpent: 580.0, lastVisit: '2 days ago', tier: 'vip', avatar: 'MG' },
  { id: '2', name: 'Alex Johnson', email: 'alex.j@email.com', phone: '+1 555-0102', totalOrders: 8, totalSpent: 192.5, lastVisit: 'Today', tier: 'regular', avatar: 'AJ' },
  { id: '3', name: 'Sarah Williams', email: 'sarah.w@email.com', phone: '+1 555-0103', totalOrders: 41, totalSpent: 1240.0, lastVisit: 'Yesterday', tier: 'vip', avatar: 'SW' },
  { id: '4', name: 'James Brown', email: 'james.b@email.com', phone: '+1 555-0104', totalOrders: 2, totalSpent: 48.0, lastVisit: '1 week ago', tier: 'new', avatar: 'JB' },
  { id: '5', name: 'Emma Davis', email: 'emma.d@email.com', phone: '+1 555-0105', totalOrders: 15, totalSpent: 345.75, lastVisit: '3 days ago', tier: 'regular', avatar: 'ED' },
  { id: '6', name: 'Michael Wilson', email: 'michael.w@email.com', phone: '+1 555-0106', totalOrders: 31, totalSpent: 890.0, lastVisit: 'Today', tier: 'vip', avatar: 'MW' },
  { id: '7', name: 'Sophie Taylor', email: 'sophie.t@email.com', phone: '+1 555-0107', totalOrders: 1, totalSpent: 22.5, lastVisit: '2 weeks ago', tier: 'new', avatar: 'ST' },
  { id: '8', name: 'Daniel Lee', email: 'daniel.l@email.com', phone: '+1 555-0108', totalOrders: 12, totalSpent: 267.0, lastVisit: '5 days ago', tier: 'regular', avatar: 'DL' },
]

const tierConfig = {
  vip: { label: 'VIP', bg: 'bg-yellow-500/20', text: 'text-yellow-400', icon: '⭐' },
  regular: { label: 'Regular', bg: 'bg-brand-primary/20', text: 'text-brand-primary', icon: '👤' },
  new: { label: 'New', bg: 'bg-brand-success/20', text: 'text-brand-success', icon: '✨' },
}

type TierFilter = 'all' | 'vip' | 'regular' | 'new'

export default function CustomersPage() {
  const [search, setSearch] = useState('')
  const [tierFilter, setTierFilter] = useState<TierFilter>('all')
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)

  const filtered = customers.filter((c) => {
    const matchesTier = tierFilter === 'all' || c.tier === tierFilter
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    return matchesTier && matchesSearch
  })

  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0)
  const vipCount = customers.filter((c) => c.tier === 'vip').length
  const avgSpend = totalRevenue / customers.length

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">Customers</h1>
        <p className="text-secondary">View and manage your customer base</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="text-center">
          <p className="text-3xl font-bold text-primary">{customers.length}</p>
          <p className="text-secondary text-sm font-medium mt-1">Total Customers</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-yellow-400">{vipCount}</p>
          <p className="text-yellow-400 text-sm font-medium mt-1">VIP Members</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-brand-success">${totalRevenue.toFixed(0)}</p>
          <p className="text-secondary text-sm font-medium mt-1">Total Revenue</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-brand-primary">${avgSpend.toFixed(0)}</p>
          <p className="text-secondary text-sm font-medium mt-1">Avg. Spend</p>
        </Card>
      </div>

      <Card>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="🔍 Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'vip', 'regular', 'new'] as TierFilter[]).map((t) => (
              <button
                key={t}
                onClick={() => setTierFilter(t)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-fast ${
                  tierFilter === t ? 'bg-brand-primary text-white' : 'bg-[#374151] text-secondary hover:text-primary'
                }`}
              >
                {t === 'all' ? 'All' : tierConfig[t as keyof typeof tierConfig].icon + ' ' + tierConfig[t as keyof typeof tierConfig].label}
              </button>
            ))}
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-4 pb-3 border-b border-muted text-secondary text-xs font-bold uppercase tracking-wide">
          <div className="col-span-4">Customer</div>
          <div className="col-span-2 text-center hidden sm:block">Orders</div>
          <div className="col-span-2 text-center hidden md:block">Total Spent</div>
          <div className="col-span-2 text-center hidden lg:block">Last Visit</div>
          <div className="col-span-2 text-center">Tier</div>
        </div>

        {/* Customer List */}
        <div className="space-y-2 mt-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-4">👥</p>
              <p className="text-secondary">No customers found</p>
            </div>
          ) : (
            filtered.map((customer) => {
              const tier = tierConfig[customer.tier]
              return (
                <div key={customer.id}>
                  <div
                    onClick={() => setSelectedCustomer(selectedCustomer === customer.id ? null : customer.id)}
                    className="grid grid-cols-12 gap-4 items-center px-4 py-3 bg-[#374151] rounded-lg hover:bg-[#4B5563] transition-all duration-fast cursor-pointer"
                  >
                    <div className="col-span-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {customer.avatar}
                      </div>
                      <div className="min-w-0">
                        <p className="text-primary font-medium truncate">{customer.name}</p>
                        <p className="text-secondary text-xs truncate">{customer.email}</p>
                      </div>
                    </div>
                    <div className="col-span-2 text-center text-primary font-bold hidden sm:block">
                      {customer.totalOrders}
                    </div>
                    <div className="col-span-2 text-center text-brand-success font-bold hidden md:block">
                      ${customer.totalSpent.toFixed(0)}
                    </div>
                    <div className="col-span-2 text-center text-secondary text-sm hidden lg:block">
                      {customer.lastVisit}
                    </div>
                    <div className="col-span-2 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${tier.bg} ${tier.text}`}>
                        {tier.icon} {tier.label}
                      </span>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {selectedCustomer === customer.id && (
                    <div className="mx-1 mb-2 p-4 bg-[#1A1A2E] rounded-b-lg border border-[#374151] border-t-0">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-secondary text-xs">Phone</p>
                          <p className="text-primary text-sm font-medium">{customer.phone}</p>
                        </div>
                        <div>
                          <p className="text-secondary text-xs">Total Orders</p>
                          <p className="text-primary text-sm font-medium">{customer.totalOrders}</p>
                        </div>
                        <div>
                          <p className="text-secondary text-xs">Lifetime Value</p>
                          <p className="text-brand-success text-sm font-medium">${customer.totalSpent.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-secondary text-xs">Avg. Order</p>
                          <p className="text-primary text-sm font-medium">${(customer.totalSpent / customer.totalOrders).toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button variant="primary" size="sm">View History</Button>
                        <Button variant="secondary" size="sm">Send Offer</Button>
                        {customer.tier !== 'vip' && <Button variant="ghost" size="sm">Upgrade to VIP</Button>}
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        {filtered.length > 0 && (
          <div className="mt-4 pt-4 border-t border-muted flex justify-between items-center">
            <p className="text-secondary text-sm">{filtered.length} customers shown</p>
            <Button variant="secondary" size="sm">Export CSV</Button>
          </div>
        )}
      </Card>
    </MainLayout>
  )
}
