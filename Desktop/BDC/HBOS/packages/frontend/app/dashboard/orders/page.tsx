'use client'

import React, { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card } from '@/components/common/Card'
import Button from '@/components/common/Button'

type OrderStatus = 'all' | 'pending' | 'in_preparation' | 'ready' | 'delivered' | 'cancelled'

interface Order {
  id: string
  customer: string
  type: 'dine_in' | 'takeout' | 'delivery'
  table?: string
  items: number
  total: number
  status: Omit<OrderStatus, 'all'>
  time: string
  createdAt: string
}

const orders: Order[] = [
  { id: 'ORD-001', customer: 'Table 5', type: 'dine_in', table: '5', items: 3, total: 42.5, status: 'pending', time: '2m ago', createdAt: '12:45 PM' },
  { id: 'ORD-002', customer: 'Table 3', type: 'dine_in', table: '3', items: 2, total: 28.99, status: 'in_preparation', time: '7m ago', createdAt: '12:40 PM' },
  { id: 'ORD-003', customer: 'John Smith', type: 'takeout', items: 5, total: 64.5, status: 'ready', time: '12m ago', createdAt: '12:35 PM' },
  { id: 'ORD-004', customer: 'Table 7', type: 'dine_in', table: '7', items: 2, total: 19.98, status: 'pending', time: '1m ago', createdAt: '12:46 PM' },
  { id: 'ORD-005', customer: 'Maria Garcia', type: 'delivery', items: 4, total: 55.0, status: 'in_preparation', time: '15m ago', createdAt: '12:32 PM' },
  { id: 'ORD-006', customer: 'Table 2', type: 'dine_in', table: '2', items: 6, total: 92.4, status: 'delivered', time: '25m ago', createdAt: '12:22 PM' },
  { id: 'ORD-007', customer: 'Alex Johnson', type: 'takeout', items: 1, total: 12.99, status: 'delivered', time: '30m ago', createdAt: '12:17 PM' },
  { id: 'ORD-008', customer: 'Table 9', type: 'dine_in', table: '9', items: 3, total: 37.5, status: 'cancelled', time: '35m ago', createdAt: '12:12 PM' },
]

const statusConfig = {
  pending: { label: 'Pending', bg: 'bg-brand-warning/20', text: 'text-brand-warning' },
  in_preparation: { label: 'Preparing', bg: 'bg-blue-500/20', text: 'text-blue-400' },
  ready: { label: 'Ready', bg: 'bg-brand-success/20', text: 'text-brand-success' },
  delivered: { label: 'Delivered', bg: 'bg-[#374151]', text: 'text-secondary' },
  cancelled: { label: 'Cancelled', bg: 'bg-brand-error/20', text: 'text-brand-error' },
}

const typeIcon = {
  dine_in: '🍽️',
  takeout: '📦',
  delivery: '🚗',
}

const tabs: { key: OrderStatus; label: string }[] = [
  { key: 'all', label: 'All Orders' },
  { key: 'pending', label: 'Pending' },
  { key: 'in_preparation', label: 'Preparing' },
  { key: 'ready', label: 'Ready' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' },
]

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<OrderStatus>('all')
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

  const filtered = activeTab === 'all' ? orders : orders.filter((o) => o.status === activeTab)

  const counts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    in_preparation: orders.filter((o) => o.status === 'in_preparation').length,
    ready: orders.filter((o) => o.status === 'ready').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
  }

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">Orders</h1>
        <p className="text-secondary">Track and manage all restaurant orders</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="text-center">
          <p className="text-3xl font-bold text-primary">{counts.pending}</p>
          <p className="text-brand-warning text-sm font-medium mt-1">Pending</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-primary">{counts.in_preparation}</p>
          <p className="text-blue-400 text-sm font-medium mt-1">Preparing</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-primary">{counts.ready}</p>
          <p className="text-brand-success text-sm font-medium mt-1">Ready</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-primary">{counts.delivered}</p>
          <p className="text-secondary text-sm font-medium mt-1">Delivered</p>
        </Card>
      </div>

      <Card>
        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 border-b border-muted pb-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-fast ${
                activeTab === tab.key
                  ? 'bg-brand-primary text-white'
                  : 'text-secondary hover:text-primary hover:bg-[#374151]'
              }`}
            >
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? 'bg-white/20' : 'bg-[#374151]'}`}>
                {counts[tab.key]}
              </span>
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-4">📋</p>
              <p className="text-secondary">No orders in this category</p>
            </div>
          ) : (
            filtered.map((order) => {
              const config = statusConfig[order.status as keyof typeof statusConfig]
              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                  className="p-4 bg-[#374151] rounded-lg hover:bg-[#4B5563] transition-all duration-fast cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <span className="text-2xl">{typeIcon[order.type]}</span>
                      <div className="min-w-0">
                        <p className="font-mono font-bold text-primary">{order.id}</p>
                        <p className="text-secondary text-sm">
                          {order.customer} · {order.items} items
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 shrink-0">
                      <div className="hidden sm:block text-right">
                        <p className="text-primary font-bold">${order.total.toFixed(2)}</p>
                        <p className="text-secondary text-xs">{order.createdAt}</p>
                      </div>

                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                        {config.label}
                      </span>

                      <p className="text-secondary text-sm w-16 text-right">{order.time}</p>
                    </div>
                  </div>

                  {/* Expanded Actions */}
                  {selectedOrder === order.id && (
                    <div className="mt-4 pt-4 border-t border-[#4B5563] flex gap-3 flex-wrap">
                      {order.status === 'pending' && (
                        <Button variant="primary" size="sm">Start Preparing</Button>
                      )}
                      {order.status === 'in_preparation' && (
                        <Button variant="success" size="sm">Mark Ready</Button>
                      )}
                      {order.status === 'ready' && (
                        <Button variant="success" size="sm">Mark Delivered</Button>
                      )}
                      {order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <Button variant="error" size="sm">Cancel Order</Button>
                      )}
                      <Button variant="secondary" size="sm">🖨️ Print Receipt</Button>
                      <Button variant="ghost" size="sm">View Details</Button>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </Card>
    </MainLayout>
  )
}
