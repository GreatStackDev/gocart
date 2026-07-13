'use client'

/**
 * tradrsAvenue — Button primitive
 * Three variants: primary (indigo), accent (amber), outline (white+border)
 * Subtle hover: translateY(-2px) + shadow step up
 */

import React from 'react'

const variants = {
    primary: 'bg-[#1E1B4B] text-white hover:bg-[#312E81]',
    accent:  'bg-[#F59E0B] text-white hover:bg-[#D97706]',
    outline: 'border border-[#E5E7EB] bg-white text-[#111827] hover:bg-[#FAFAF7]',
    danger:  'bg-[#EF4444] text-white hover:bg-[#DC2626]',
    ghost:   'text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6]',
}

const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
}

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    loading = false,
    ...props
}) {
    return (
        <button
            disabled={disabled || loading}
            className={`
                inline-flex items-center justify-center gap-2 rounded-[8px] font-medium
                transition-all duration-150 ease-in-out
                hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)]
                active:translate-y-0 active:shadow-none
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                focus-visible:outline-2 focus-visible:outline-[#1E1B4B] focus-visible:outline-offset-2
                ${variants[variant]}
                ${sizes[size]}
                ${className}
            `.trim()}
            {...props}
        >
            {loading ? (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : null}
            {children}
        </button>
    )
}
