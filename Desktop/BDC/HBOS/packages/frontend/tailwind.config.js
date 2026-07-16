/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Restaurant-focused color palette
        brand: {
          primary: '#0D7377',      // Deep Restaurant Teal
          success: '#23AA6E',      // Fresh Green (completed orders)
          warning: '#FF9E1B',      // Warm Orange (low stock)
          error: '#E63946',        // Restaurant Red (alerts)
          neutral: '#1A1A2E',      // Dark Slate (dark mode base)
          light: '#F8F9FA',        // Off-white
          muted: '#6B7280',        // Muted gray
        },
        status: {
          pending: '#FFA500',
          processing: '#3B82F6',
          succeeded: '#10B981',
          failed: '#E63946',
          cancelled: '#6B7280',
        },
      },
      backgroundColor: {
        dark: '#0F0F1E',
        card: '#1A1A2E',
      },
      textColor: {
        primary: '#FFFFFF',
        secondary: '#D1D5DB',
      },
      borderColor: {
        muted: '#374151',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '2.5rem',
        '3xl': '3rem',
        '4xl': '4rem',
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgb(0 0 0 / 0.15)',
        sm: '0 1px 3px 0 rgb(0 0 0 / 0.2)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.25)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.3)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.35)',
        glow: '0 0 20px 0 rgb(13 115 119 / 0.4)',
      },
      borderRadius: {
        none: '0',
        xs: '0.25rem',
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        full: '9999px',
      },
      transitionDuration: {
        fast: '150ms',
        default: '200ms',
        slow: '300ms',
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in',
        slideInDown: 'slideInDown 0.3s ease-out',
        slideInUp: 'slideInUp 0.3s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2s infinite',
        bounce: 'bounce 1s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(-25%)' },
          '50%': { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
