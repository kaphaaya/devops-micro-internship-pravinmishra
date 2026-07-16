import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  children: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading = false, className = '', disabled, ...props }, ref) => {
    const baseStyles = 'font-medium transition-all duration-fast font-sans rounded-lg flex items-center justify-center gap-2'

    const variantStyles = {
      primary: 'bg-brand-primary text-white hover:bg-[#095B63] active:bg-[#064852]',
      secondary: 'bg-[#374151] text-white hover:bg-[#4B5563] active:bg-[#1F2937]',
      success: 'bg-brand-success text-white hover:bg-[#1B8A56] active:bg-[#147A4A]',
      warning: 'bg-brand-warning text-white hover:bg-[#E68A09] active:bg-[#CC7C08]',
      error: 'bg-brand-error text-white hover:bg-[#D42839] active:bg-[#BB1E2D]',
      ghost: 'bg-transparent text-brand-primary hover:bg-[#0D7377]/10 border border-[#0D7377]/30',
    }

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    }

    const disabledStyles = disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.2" />
            <path fill="currentColor" d="M4 12a8 8 0 018-8v0a8 8 0 100 16v0a8 8 0 00-8-8z" />
          </svg>
        )}
        {props.children}
      </button>
    )
  },
)

Button.displayName = 'Button'

export default Button
