'use client'

import React, { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card } from '@/components/common/Card'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'

type Category = 'all' | 'produce' | 'meat' | 'dairy' | 'dry_goods' | 'beverages'

interface InventoryItem {
  id: string
  name: string
  category: Omit<Category, 'all'>
  stock: number
  unit: string
  costPerUnit: number
  reorderLevel: number
  supplier: string
}

const inventory: InventoryItem[] = [
  { id: '1', name: 'Tomatoes', category: 'produce', stock: 5, unit: 'kg', costPerUnit: 2.5, reorderLevel: 20, supplier: 'Fresh Farms' },
  { id: '2', name: 'Mozzarella', category: 'dairy', stock: 3, unit: 'kg', costPerUnit: 8.0, reorderLevel: 10, supplier: 'Dairy Direct' },
  { id: '3', name: 'Chicken Breast', category: 'meat', stock: 12, unit: 'kg', costPerUnit: 6.5, reorderLevel: 10, supplier: 'Quality Meats' },
  { id: '4', name: 'Pasta', category: 'dry_goods', stock: 25, unit: 'kg', costPerUnit: 1.2, reorderLevel: 10, supplier: 'Bulk Foods Co' },
  { id: '5', name: 'Olive Oil', category: 'dry_goods', stock: 8, unit: 'L', costPerUnit: 7.0, reorderLevel: 5, supplier: 'Italian Imports' },
  { id: '6', name: 'Ground Beef', category: 'meat', stock: 15, unit: 'kg', costPerUnit: 5.8, reorderLevel: 10, supplier: 'Quality Meats' },
  { id: '7', name: 'Lettuce', category: 'produce', stock: 0, unit: 'head', costPerUnit: 1.5, reorderLevel: 10, supplier: 'Fresh Farms' },
  { id: '8', name: 'Cheddar Cheese', category: 'dairy', stock: 6, unit: 'kg', costPerUnit: 9.0, reorderLevel: 5, supplier: 'Dairy Direct' },
  { id: '9', name: 'Sparkling Water', category: 'beverages', stock: 48, unit: 'bottle', costPerUnit: 0.8, reorderLevel: 24, supplier: 'Beverage World' },
  { id: '10', name: 'Flour', category: 'dry_goods', stock: 30, unit: 'kg', costPerUnit: 0.9, reorderLevel: 15, supplier: 'Bulk Foods Co' },
  { id: '11', name: 'Salmon Fillet', category: 'meat', stock: 4, unit: 'kg', costPerUnit: 18.0, reorderLevel: 5, supplier: 'Ocean Fresh' },
  { id: '12', name: 'Heavy Cream', category: 'dairy', stock: 9, unit: 'L', costPerUnit: 3.5, reorderLevel: 5, supplier: 'Dairy Direct' },
]

const categoryConfig = {
  produce: { label: 'Produce', icon: '🥦', color: 'text-green-400' },
  meat: { label: 'Meat & Seafood', icon: '🥩', color: 'text-red-400' },
  dairy: { label: 'Dairy', icon: '🧀', color: 'text-yellow-400' },
  dry_goods: { label: 'Dry Goods', icon: '🌾', color: 'text-orange-400' },
  beverages: { label: 'Beverages', icon: '🥤', color: 'text-blue-400' },
}

function getStockStatus(item: InventoryItem) {
  if (item.stock === 0) return { label: 'Out of Stock', bg: 'bg-brand-error/20', text: 'text-brand-error' }
  if (item.stock <= item.reorderLevel * 0.3) return { label: 'Critical', bg: 'bg-brand-error/20', text: 'text-brand-error' }
  if (item.stock <= item.reorderLevel) return { label: 'Low Stock', bg: 'bg-brand-warning/20', text: 'text-brand-warning' }
  return { label: 'In Stock', bg: 'bg-brand-success/20', text: 'text-brand-success' }
}

export default function InventoryPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('all')
  const [search, setSearch] = useState('')

  const lowStockItems = inventory.filter((i) => i.stock <= i.reorderLevel)
  const outOfStockItems = inventory.filter((i) => i.stock === 0)

  const filtered = inventory.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const totalValue = inventory.reduce((sum, item) => sum + item.stock * item.costPerUnit, 0)

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">Inventory</h1>
        <p className="text-secondary">Track and manage stock levels</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="text-center">
          <p className="text-3xl font-bold text-primary">{inventory.length}</p>
          <p className="text-secondary text-sm font-medium mt-1">Total Items</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-brand-warning">{lowStockItems.length}</p>
          <p className="text-brand-warning text-sm font-medium mt-1">Low Stock</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-brand-error">{outOfStockItems.length}</p>
          <p className="text-brand-error text-sm font-medium mt-1">Out of Stock</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-brand-success">${totalValue.toFixed(0)}</p>
          <p className="text-secondary text-sm font-medium mt-1">Stock Value</p>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="mb-6 border-l-4 border-l-brand-warning">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-primary flex items-center gap-2">
              <span>⚠️</span> Items Needing Reorder
            </h3>
            <Button variant="warning" size="sm">Order All</Button>
          </div>
          <div className="flex flex-wrap gap-3">
            {lowStockItems.map((item) => (
              <div key={item.id} className="px-3 py-2 bg-brand-warning/10 border border-brand-warning/30 rounded-lg">
                <p className="text-primary font-medium text-sm">{item.name}</p>
                <p className="text-brand-warning text-xs">{item.stock} {item.unit} left</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="🔍 Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-fast ${
                activeCategory === 'all' ? 'bg-brand-primary text-white' : 'bg-[#374151] text-secondary hover:text-primary'
              }`}
            >
              All
            </button>
            {(Object.keys(categoryConfig) as Array<keyof typeof categoryConfig>).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as Category)}
                className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-fast ${
                  activeCategory === cat ? 'bg-brand-primary text-white' : 'bg-[#374151] text-secondary hover:text-primary'
                }`}
              >
                {categoryConfig[cat].icon} {categoryConfig[cat].label}
              </button>
            ))}
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-4 pb-3 border-b border-muted text-secondary text-xs font-bold uppercase tracking-wide">
          <div className="col-span-4">Item</div>
          <div className="col-span-2 text-center">Stock</div>
          <div className="col-span-2 text-center hidden sm:block">Reorder At</div>
          <div className="col-span-2 text-center hidden md:block">Cost/Unit</div>
          <div className="col-span-2 text-center">Status</div>
        </div>

        {/* Items */}
        <div className="space-y-2 mt-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-4">📦</p>
              <p className="text-secondary">No items found</p>
            </div>
          ) : (
            filtered.map((item) => {
              const status = getStockStatus(item)
              const catConfig = categoryConfig[item.category as keyof typeof categoryConfig]
              const stockPercent = Math.min(100, (item.stock / (item.reorderLevel * 2)) * 100)
              return (
                <div key={item.id} className="grid grid-cols-12 gap-4 items-center px-4 py-3 bg-[#374151] rounded-lg hover:bg-[#4B5563] transition-all duration-fast">
                  <div className="col-span-4">
                    <p className="text-primary font-medium">{item.name}</p>
                    <p className={`text-xs ${catConfig.color}`}>{catConfig.icon} {catConfig.label}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-primary font-bold text-center">{item.stock} {item.unit}</p>
                    <div className="w-full bg-[#1A1A2E] rounded-full h-1 mt-1">
                      <div
                        className={`h-1 rounded-full ${item.stock === 0 ? 'bg-brand-error' : item.stock <= item.reorderLevel ? 'bg-brand-warning' : 'bg-brand-success'}`}
                        style={{ width: `${stockPercent}%` }}
                      />
                    </div>
                  </div>
                  <div className="col-span-2 text-center text-secondary text-sm hidden sm:block">
                    {item.reorderLevel} {item.unit}
                  </div>
                  <div className="col-span-2 text-center text-secondary text-sm hidden md:block">
                    ${item.costPerUnit.toFixed(2)}
                  </div>
                  <div className="col-span-2 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                      {status.label}
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {filtered.length > 0 && (
          <div className="mt-4 pt-4 border-t border-muted flex justify-between items-center">
            <p className="text-secondary text-sm">{filtered.length} items shown</p>
            <Button variant="secondary" size="sm">Export CSV</Button>
          </div>
        )}
      </Card>
    </MainLayout>
  )
}
