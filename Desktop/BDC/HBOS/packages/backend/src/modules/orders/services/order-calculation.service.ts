import { Injectable } from '@nestjs/common'
import { Decimal } from 'decimal.js'

/**
 * Order Calculation Service
 * Handles monetary calculations with precision
 */
@Injectable()
export class OrderCalculationService {
  /**
   * Calculate item total (quantity × unitPrice)
   */
  calculateItemSubtotal(quantity: number, unitPrice: number): number {
    const q = new Decimal(quantity)
    const p = new Decimal(unitPrice)
    return parseFloat(q.times(p).toFixed(2))
  }

  /**
   * Calculate tax for an item
   */
  calculateItemTax(subtotal: number, taxPercentage: number): number {
    if (taxPercentage === 0) return 0
    const sub = new Decimal(subtotal)
    const tax = new Decimal(taxPercentage).dividedBy(100)
    return parseFloat(sub.times(tax).toFixed(2))
  }

  /**
   * Calculate order subtotal (sum of all item subtotals)
   */
  calculateOrderSubtotal(itemSubtotals: number[]): number {
    const sum = itemSubtotals.reduce((acc, val) => new Decimal(acc).plus(new Decimal(val)), new Decimal(0))
    return parseFloat(sum.toFixed(2))
  }

  /**
   * Calculate order tax (sum of all item taxes)
   */
  calculateOrderTax(itemTaxes: number[]): number {
    const sum = itemTaxes.reduce((acc, val) => new Decimal(acc).plus(new Decimal(val)), new Decimal(0))
    return parseFloat(sum.toFixed(2))
  }

  /**
   * Calculate order total (subtotal + tax - discount)
   */
  calculateOrderTotal(subtotal: number, taxAmount: number, discountAmount: number = 0): number {
    const sub = new Decimal(subtotal)
    const tax = new Decimal(taxAmount)
    const discount = new Decimal(discountAmount)
    return parseFloat(sub.plus(tax).minus(discount).toFixed(2))
  }

  /**
   * Round to 2 decimal places
   */
  round(value: number): number {
    return parseFloat(new Decimal(value).toFixed(2))
  }
}
