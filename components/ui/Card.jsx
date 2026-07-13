/**
 * tradrsAvenue — Card primitive
 * White surface card with consistent shadow, border, and radius.
 * Optional hover lift via the card-hover CSS utility class.
 */

import React from 'react'

export default function Card({
    children,
    className = '',
    hoverable = false,
    padding = true,
    ...props
}) {
    return (
        <div
            className={`
                bg-white rounded-[12px] border border-[#E5E7EB]
                shadow-[0_1px_3px_rgba(0,0,0,0.08)]
                ${hoverable ? 'card-hover cursor-pointer' : ''}
                ${padding ? 'p-6' : ''}
                ${className}
            `.trim()}
            {...props}
        >
            {children}
        </div>
    )
}
