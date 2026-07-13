/**
 * tradrsAvenue — Badge primitive
 * Pill-shaped status badges. Flat colors, no gradients.
 */

import React from 'react'

const variants = {
    verified:     'bg-[#D1FAE5] text-[#065F46]',
    pending:      'bg-[#FEF3C7] text-[#92400E]',
    inStock:      'bg-[#D1FAE5] text-[#065F46]',
    outOfStock:   'bg-[#FEE2E2] text-[#991B1B]',
    freeShipping: 'bg-[#FEF3C7] text-[#92400E]',
    pro:          'bg-[#EEF2FF] text-[#1E1B4B]',
    new:          'bg-[#1E1B4B] text-white',
    danger:       'bg-[#FEE2E2] text-[#991B1B]',
    neutral:      'bg-[#F3F4F6] text-[#374151]',
}

export default function Badge({ children, variant = 'neutral', className = '' }) {
    return (
        <span
            className={`
                inline-flex items-center gap-1
                rounded-full px-2.5 py-0.5
                text-xs font-medium
                ${variants[variant]}
                ${className}
            `.trim()}
        >
            {children}
        </span>
    )
}
