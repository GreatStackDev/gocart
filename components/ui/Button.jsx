'use client'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

const Button = forwardRef(({ 
  className,
  variant = "default",
  size = "default",
  asChild = false,
  children,
  disabled,
  loading,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95"
  
  const variants = {
    default: "bg-slate-800 text-white hover:bg-slate-900 hover:shadow-lg hover:-translate-y-0.5 shadow-md",
    destructive: "bg-red-600 text-white hover:bg-red-700 hover:shadow-lg",
    outline: "border border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 text-slate-700",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    ghost: "hover:bg-slate-100 hover:text-slate-900",
    link: "text-green-600 underline-offset-4 hover:underline",
    gradient: "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl"
  }

  const sizes = {
    default: "h-10 px-6 py-2",
    sm: "h-8 rounded-md px-4 text-sm",
    lg: "h-12 rounded-lg px-8 text-lg",
    icon: "h-10 w-10",
  }

  const Component = asChild ? "span" : "button"

  return (
    <Component
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        disabled && "opacity-50 cursor-not-allowed",
        loading && "cursor-wait",
        className
      )}
      ref={ref}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </Component>
  )
})

Button.displayName = "Button"

export { Button }