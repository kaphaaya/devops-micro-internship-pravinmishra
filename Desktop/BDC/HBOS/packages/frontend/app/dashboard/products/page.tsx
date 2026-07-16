'use client'

import React, { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card } from '@/components/common/Card'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'

type Category = 'all' | 'starters' | 'mains' | 'desserts' | 'drinks'

interface Product {
  id: string
  name: string
  category: Omit<Category, 'all'>
  price: number
  cost: number
  icon: string
  available: boolean
  orders: number
  description: string
}

const products: Product[] = [
  { id: '1', name: 'Margherita Pizza', category: 'mains', price: 12.99, cost: 3.5, icon: '🍕', available: true, orders: 142, description: 'Classic tomato, mozzarella, basil' },
  { id: '2', name: 'Pepperoni Pizza', category: 'mains', price: 14.99, cost: 4.2, icon: '🍕', available: true, orders: 128, description: 'Tomato sauce, mozzarella, pepperoni' },
  { id: '3', name: 'Caesar Salad', category: 'starters', price: 8.99, cost: 2.1, icon: '🥗', available: true, orders: 87, description: 'Romaine, croutons, parmesan, caesar dressing' },
  { id: '4', name: 'Garlic Bread', category: 'starters', price: 4.99, cost: 1.0, icon: '🥖', available: true, orders: 203, description: 'Toasted bread with garlic butter' },
  { id: '5', name: 'Pasta Carbonara', category: 'mains', price: 13.99, cost: 3.8, icon: '🍝', available: true, orders: 95, description: 'Spaghetti, eggs, pancetta, parmesan' },
  { id: '6', name: 'Classic Burger', category: 'mains', price: 11.99, cost: 3.2, icon: '🍔', available: true, orders: 167, description: 'Beef patty, lettuce, tomato, pickles' },
  { id: '7', name: 'Fried Chicken', category: 'mains', price: 10.99, cost: 2.9, icon: '🍗', available: false, orders: 74, description: 'Crispy fried chicken with dipping sauce' },
  { id: '8', name: 'Tiramisu', category: 'desserts', price: 6.99, cost: 1.8, icon: '🍰', available: true, orders: 56, description: 'Classic Italian coffee dessert' },
  { id: '9', name: 'Chocolate Lava Cake', category: 'desserts', price: 7.99, cost: 2.0, icon: '🍫', available: true, orders: 43, description: 'Warm chocolate cake with molten center' },
  { id: '10', name: 'Sparkling Water', category: 'drinks', price: 2.99, cost: 0.5, icon: '🥤', available: true, orders: 312, description: '500ml sparkling mineral water' },
  { id: '11', name: 'Fresh Orange Juice', category: 'drinks', price: 4.99, cost: 1.2, icon: '🍊', available: true, orders: 89, description: 'Freshly squeezed orange juice' },
  { id: '12', name: 'Bruschetta', category: 'starters', price: 7.99, cost: 1.8, icon: '🍅', available: true, orders: 61, description: 'Toasted bread with tomatoes and basil' },
]

const categoryConfig: Record<string, { label: string; icon: string }> = {
  starters: { label: 'Starters', icon: '🥗' },
  mains: { label: 'Main Courses', icon: '🍽️' },
  desserts: { label: 'Desserts', icon: '🍰' },
  drinks: { label: 'Drinks', icon: '🥤' },
}

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('all')
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filtered = products.filter((p) => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const totalProducts = products.length
  const availableCount = products.filter((p) => p.available).length
  const topProduct = products.reduce((a, b) => (a.orders > b.orders ? a : b))
  const avgMargin = products.reduce((sum, p) => sum + ((p.price - p.cost) / p.price) * 100, 0) / products.length

  return (
    <MainLayout>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2">Menu & Products</h1>
          <p className="text-secondary">Manage your restaurant menu items</p>
        </div>
        <Button variant="primary">+ Add Product</Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="text-center">
          <p className="text-3xl font-bold text-primary">{totalProducts}</p>
          <p className="text-secondary text-sm font-medium mt-1">Total Items</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-brand-success">{availableCount}</p>
          <p className="text-brand-success text-sm font-medium mt-1">Available</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-brand-warning">{topProduct.orders}</p>
          <p className="text-secondary text-sm font-medium mt-1">Top Item Orders</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-brand-primary">{avgMargin.toFixed(0)}%</p>
          <p className="text-secondary text-sm font-medium mt-1">Avg. Margin</p>
        </Card>
      </div>

      <Card>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="🔍 Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 rounded-lg text-sm transition-all duration-fast ${viewMode === 'grid' ? 'bg-brand-primary text-white' : 'bg-[#374151] text-secondary hover:text-primary'}`}
            >
              ⊞ Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-lg text-sm transition-all duration-fast ${viewMode === 'list' ? 'bg-brand-primary text-white' : 'bg-[#374151] text-secondary hover:text-primary'}`}
            >
              ☰ List
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-fast ${
              activeCategory === 'all' ? 'bg-brand-primary text-white' : 'bg-[#374151] text-secondary hover:text-primary'
            }`}
          >
            All ({products.length})
          </button>
          {(Object.entries(categoryConfig) as [string, { label: string; icon: string }][]).map(([key, val]) => {
            const count = products.filter((p) => p.category === key).length
            return (
              <button
                key={key}
                onClick={() => setActiveCategory(key as Category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-fast ${
                  activeCategory === key ? 'bg-brand-primary text-white' : 'bg-[#374151] text-secondary hover:text-primary'
                }`}
              >
                {val.icon} {val.label} ({count})
              </button>
            )
          })}
        </div>

        {/* Products */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">🍽️</p>
            <p className="text-secondary">No products found</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((product) => {
              const margin = ((product.price - product.cost) / product.price * 100).toFixed(0)
              return (
                <div
                  key={product.id}
                  className={`p-4 bg-[#374151] rounded-lg hover:bg-[#4B5563] transition-all duration-fast ${!product.available ? 'opacity-60' : ''}`}
                >
                  <div className="text-4xl mb-3 text-center">{product.icon}</div>
                  <p className="text-primary font-bold text-center mb-1">{product.name}</p>
                  <p className="text-secondary text-xs text-center mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-brand-success font-bold text-lg">${product.price.toFixed(2)}</span>
                    <span className="text-secondary text-xs">{margin}% margin</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-secondary text-xs">{product.orders} orders</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${product.available ? 'bg-brand-success/20 text-brand-success' : 'bg-brand-error/20 text-brand-error'}`}>
                      {product.available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" className="flex-1 text-xs">Edit</Button>
                    <Button variant={product.available ? 'error' : 'success'} size="sm" className="flex-1 text-xs">
                      {product.available ? 'Disable' : 'Enable'}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="grid grid-cols-12 gap-4 px-4 pb-3 border-b border-muted text-secondary text-xs font-bold uppercase tracking-wide">
              <div className="col-span-4">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center hidden sm:block">Margin</div>
              <div className="col-span-2 text-center hidden md:block">Orders</div>
              <div className="col-span-2 text-center">Status</div>
            </div>
            {filtered.map((product) => {
              const margin = ((product.price - product.cost) / product.price * 100).toFixed(0)
              return (
                <div
                  key={product.id}
                  className={`grid grid-cols-12 gap-4 items-center px-4 py-3 bg-[#374151] rounded-lg hover:bg-[#4B5563] transition-all duration-fast ${!product.available ? 'opacity-60' : ''}`}
                >
                  <div className="col-span-4 flex items-center gap-3">
                    <span className="text-2xl">{product.icon}</span>
                    <div>
                      <p className="text-primary font-medium">{product.name}</p>
                      <p className="text-secondary text-xs">{categoryConfig[product.category as string]?.label}</p>
                    </div>
                  </div>
                  <div className="col-span-2 text-center text-brand-success font-bold">
                    ${product.price.toFixed(2)}
                  </div>
                  <div className="col-span-2 text-center text-secondary text-sm hidden sm:block">
                    {margin}%
                  </div>
                  <div className="col-span-2 text-center text-primary font-medium hidden md:block">
                    {product.orders}
                  </div>
                  <div className="col-span-2 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.available ? 'bg-brand-success/20 text-brand-success' : 'bg-brand-error/20 text-brand-error'}`}>
                      {product.available ? 'Available' : 'Off'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {filtered.length > 0 && (
          <div className="mt-4 pt-4 border-t border-muted flex justify-between items-center">
            <p className="text-secondary text-sm">{filtered.length} products shown</p>
            <Button variant="secondary" size="sm">Export Menu</Button>
          </div>
        )}
      </Card>
    </MainLayout>
  )
}
