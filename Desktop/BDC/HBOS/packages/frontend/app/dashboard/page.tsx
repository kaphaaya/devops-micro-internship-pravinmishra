'use client'

import React from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card, MetricCard } from '@/components/common/Card'
import Button from '@/components/common/Button'

export default function DashboardPage() {
  // Sample data - in real app, would come from API
  const metrics = {
    revenue: { value: '$2,340', change: { value: 15, direction: 'up' as const } },
    orders: { value: '42', change: { value: 3, direction: 'down' as const } },
    avgOrderValue: { value: '$55.71', change: { value: 8, direction: 'up' as const } },
    satisfaction: { value: '4.2★', change: { value: 2, direction: 'up' as const } },
  }

  const liveOrders = [
    { id: 'ORD-001', customer: 'Table 5', items: 3, status: 'pending', time: '2m' },
    { id: 'ORD-002', customer: 'Table 3', items: 2, status: 'in_preparation', time: '5m' },
    { id: 'ORD-003', customer: 'Takeout', items: 5, status: 'ready', time: '8m' },
    { id: 'ORD-004', customer: 'Table 7', items: 2, status: 'pending', time: '1m' },
  ]

  const busyTimes = [
    { time: '11am-1pm', busyness: 85, label: 'BUSY' },
    { time: '1pm-3pm', busyness: 35, label: 'SLOW' },
    { time: '5pm-8pm', busyness: 95, label: 'PEAK' },
  ]

  const lowStockAlerts = [
    { item: 'Tomatoes', stock: 5, reorder: 50 },
    { item: 'Cheese', stock: 3, reorder: 20 },
  ]

  return (
    <MainLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">Dashboard</h1>
        <p className="text-secondary">Real-time restaurant operations overview</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          label="Today's Revenue"
          value={metrics.revenue.value}
          change={metrics.revenue.change}
          icon="💰"
        />
        <MetricCard
          label="Total Orders"
          value={metrics.orders.value}
          change={metrics.orders.change}
          icon="📋"
        />
        <MetricCard
          label="Avg Order Value"
          value={metrics.avgOrderValue.value}
          change={metrics.avgOrderValue.change}
          icon="📊"
        />
        <MetricCard
          label="Satisfaction"
          value={metrics.satisfaction.value}
          change={metrics.satisfaction.change}
          icon="⭐"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Live Order Queue */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-primary">Live Orders</h2>
                <p className="text-secondary text-sm">{liveOrders.length} orders active</p>
              </div>
              <Button variant="primary" size="sm">
                New Order
              </Button>
            </div>

            {/* Order Table */}
            <div className="space-y-3">
              {liveOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-[#374151] rounded-lg hover:bg-[#4B5563] transition-all duration-fast">
                  <div className="flex-1">
                    <p className="font-mono font-bold text-primary">{order.id}</p>
                    <p className="text-secondary text-sm">{order.customer}</p>
                  </div>

                  <div className="text-center px-4">
                    <p className="text-primary font-bold">{order.items}</p>
                    <p className="text-secondary text-xs">items</p>
                  </div>

                  <div className="text-center px-4">
                    {order.status === 'pending' && (
                      <span className="px-3 py-1 bg-brand-warning/20 text-brand-warning rounded-full text-xs font-medium">
                        Pending
                      </span>
                    )}
                    {order.status === 'in_preparation' && (
                      <span className="px-3 py-1 bg-[#3B82F6]/20 text-[#3B82F6] rounded-full text-xs font-medium">
                        Preparing
                      </span>
                    )}
                    {order.status === 'ready' && (
                      <span className="px-3 py-1 bg-brand-success/20 text-brand-success rounded-full text-xs font-medium">
                        Ready
                      </span>
                    )}
                  </div>

                  <p className="text-secondary text-sm w-12 text-right">{order.time}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar - Alerts & Info */}
        <div className="space-y-6">
          {/* Low Stock Alert */}
          <Card className="border-l-4 border-l-brand-warning">
            <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <span>⚠️</span> Low Stock
            </h3>
            <div className="space-y-3">
              {lowStockAlerts.map((alert) => (
                <div key={alert.item} className="p-3 bg-brand-warning/10 rounded-lg">
                  <p className="text-primary font-medium">{alert.item}</p>
                  <p className="text-secondary text-sm">{alert.stock} left → Reorder {alert.reorder}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-bold text-primary mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="secondary" className="w-full justify-start" size="sm">
                🛒 New Order
              </Button>
              <Button variant="secondary" className="w-full justify-start" size="sm">
                📦 Inventory Check
              </Button>
              <Button variant="secondary" className="w-full justify-start" size="sm">
                💳 Process Payment
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Busy Times Heat Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-2xl font-bold text-primary mb-6">Busiest Times</h2>
            <div className="space-y-4">
              {busyTimes.map((entry) => (
                <div key={entry.time}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-secondary font-medium">{entry.time}</span>
                    <span className="text-primary font-bold">{entry.busyness}%</span>
                  </div>
                  <div className="w-full bg-[#374151] rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        entry.busyness > 80 ? 'bg-brand-error' : entry.busyness > 50 ? 'bg-brand-warning' : 'bg-brand-success'
                      }`}
                      style={{ width: `${entry.busyness}%` }}
                    />
                  </div>
                  <p className={`text-xs mt-1 ${entry.busyness > 80 ? 'text-brand-error' : 'text-brand-success'}`}>
                    {entry.label}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Performance Summary */}
        <Card>
          <h3 className="text-lg font-bold text-primary mb-4">Performance</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-secondary text-sm">Avg Prep Time</span>
                <span className="text-primary font-bold">12m</span>
              </div>
              <div className="w-full bg-[#374151] rounded-full h-2">
                <div className="bg-brand-success h-2 rounded-full" style={{ width: '75%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-secondary text-sm">Table Turnover</span>
                <span className="text-primary font-bold">2.4x</span>
              </div>
              <div className="w-full bg-[#374151] rounded-full h-2">
                <div className="bg-brand-primary h-2 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-secondary text-sm">Food Cost %</span>
                <span className="text-primary font-bold">28%</span>
              </div>
              <div className="w-full bg-[#374151] rounded-full h-2">
                <div className="bg-brand-success h-2 rounded-full" style={{ width: '60%' }} />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  )
}
