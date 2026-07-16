'use client'

import React, { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card } from '@/components/common/Card'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
}

export default function POSPage() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { id: '1', name: 'Margherita Pizza', price: 12.99, quantity: 2 },
    { id: '2', name: 'Caesar Salad', price: 8.99, quantity: 1 },
  ])
  const [orderType, setOrderType] = useState<'dine_in' | 'takeout' | 'delivery'>('dine_in')
  const [tableNumber, setTableNumber] = useState('5')

  // Calculate totals
  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.08
  const total = subtotal + tax

  const handleRemoveItem = (id: string) => {
    setOrderItems(orderItems.filter((item) => item.id !== id))
  }

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setOrderItems(orderItems.map((item) => (item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item)))
  }

  return (
    <MainLayout>
      <div className="h-screen -m-6 flex flex-col bg-dark">
        {/* Header */}
        <div className="p-6 border-b border-muted">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-primary">POS Terminal</h1>
            <div className="flex items-center gap-4">
              {/* Order Type Selector */}
              <div className="flex gap-2">
                {(['dine_in', 'takeout', 'delivery'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setOrderType(type)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-fast ${
                      orderType === type
                        ? 'bg-brand-primary text-white'
                        : 'bg-[#374151] text-secondary hover:text-primary'
                    }`}
                  >
                    {type === 'dine_in' && '🍽️ Dine In'}
                    {type === 'takeout' && '📦 Takeout'}
                    {type === 'delivery' && '🚗 Delivery'}
                  </button>
                ))}
              </div>

              {/* Table Number (for dine-in) */}
              {orderType === 'dine_in' && (
                <div className="w-32">
                  <Input
                    placeholder="Table #"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="text-lg font-bold"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto flex gap-6 p-6">
          {/* Left - Product Selection */}
          <div className="flex-1">
            <Card className="h-full">
              <div className="mb-6">
                <Input placeholder="🔍 Search products..." className="text-lg" />
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { id: '1', name: 'Margherita', price: 12.99, icon: '🍕' },
                  { id: '2', name: 'Pepperoni', price: 14.99, icon: '🍕' },
                  { id: '3', name: 'Caesar Salad', price: 8.99, icon: '🥗' },
                  { id: '4', name: 'Garlic Bread', price: 4.99, icon: '🥖' },
                  { id: '5', name: 'Pasta', price: 11.99, icon: '🍝' },
                  { id: '6', name: 'Burger', price: 10.99, icon: '🍔' },
                  { id: '7', name: 'Fried Chicken', price: 9.99, icon: '🍗' },
                  { id: '8', name: 'Soda', price: 2.99, icon: '🥤' },
                ].map((product) => (
                  <button
                    key={product.id}
                    onClick={() => {
                      const existing = orderItems.find((item) => item.id === product.id)
                      if (existing) {
                        handleUpdateQuantity(product.id, existing.quantity + 1)
                      } else {
                        setOrderItems([...orderItems, { ...product, quantity: 1 }])
                      }
                    }}
                    className="p-4 bg-[#374151] rounded-lg hover:bg-brand-primary transition-all duration-fast text-center"
                  >
                    <div className="text-3xl mb-2">{product.icon}</div>
                    <p className="text-primary font-medium text-sm">{product.name}</p>
                    <p className="text-brand-success font-bold">${product.price.toFixed(2)}</p>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Right - Order Summary & Checkout */}
          <div className="w-96 flex flex-col gap-6">
            {/* Order Items */}
            <Card className="flex-1 overflow-y-auto">
              <h2 className="text-2xl font-bold text-primary mb-4">Order</h2>
              <div className="space-y-3">
                {orderItems.length === 0 ? (
                  <p className="text-secondary text-center py-8">No items added</p>
                ) : (
                  orderItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-[#374151] rounded-lg">
                      <div className="flex-1">
                        <p className="text-primary font-medium">{item.name}</p>
                        <p className="text-secondary text-sm">${item.price.toFixed(2)}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 bg-brand-error text-white rounded text-lg font-bold hover:bg-[#BB1E2D]"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-bold text-primary">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 bg-brand-success text-white rounded text-lg font-bold hover:bg-[#1B8A56]"
                        >
                          +
                        </button>
                      </div>

                      <p className="w-16 text-right font-bold text-primary">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>

                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="ml-2 text-brand-error hover:text-brand-warning"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Totals */}
            <Card>
              <div className="space-y-3">
                <div className="flex justify-between text-secondary">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-secondary">
                  <span>Tax (8%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-muted pt-3 flex justify-between text-2xl font-bold text-brand-success">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button variant="success" size="lg" className="w-full text-lg">
                💳 Process Payment
              </Button>
              <Button variant="secondary" size="lg" className="w-full">
                🔄 Clear Order
              </Button>
              <Button variant="ghost" size="lg" className="w-full">
                🖨️ Print Receipt
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
