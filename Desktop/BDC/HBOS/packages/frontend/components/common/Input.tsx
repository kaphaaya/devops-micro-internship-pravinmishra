import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, error, icon, className = '', ...props }, ref) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-primary mb-2">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary">{icon}</div>}
        <input
          ref={ref}
          className={`
            w-full px-4 py-2.5 rounded-lg
            bg-[#374151] text-primary
            border border-muted
            focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20
            placeholder-secondary
            transition-all duration-fast
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-brand-error' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-brand-error text-sm mt-1">{error}</p>}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
