import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = false, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-card border border-muted rounded-lg p-6
        transition-all duration-fast
        ${hover ? 'hover:shadow-lg hover:border-brand-primary cursor-pointer' : 'shadow-md'}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

interface MetricCardProps {
  label: string
  value: string | number
  change?: { value: number; direction: 'up' | 'down' }
  icon?: React.ReactNode
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, change, icon }) => {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-secondary text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold mt-2 text-primary">{value}</p>
          {change && (
            <p className={`text-sm mt-2 ${change.direction === 'up' ? 'text-brand-success' : 'text-brand-error'}`}>
              {change.direction === 'up' ? '↑' : '↓'} {Math.abs(change.value)}%
            </p>
          )}
        </div>
        {icon && <div className="text-brand-primary opacity-60">{icon}</div>}
      </div>
    </Card>
  )
}
