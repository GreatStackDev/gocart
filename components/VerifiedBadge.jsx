/**
 * tradrsAvenue — VerifiedBadge
 * Shows only when verificationStatus === "verified".
 * Unverified sellers: render nothing (no negative label).
 */

import React from 'react'
import { CheckCircleIcon } from 'lucide-react'

export default function VerifiedBadge({ status, className = '' }) {
    if (status !== 'verified') return null

    return (
        <span
            className={`
                inline-flex items-center gap-1
                rounded-full px-2 py-0.5
                bg-[#D1FAE5] text-[#065F46]
                text-xs font-medium
                ${className}
            `.trim()}
        >
            <CheckCircleIcon size={11} strokeWidth={2.5} />
            Verified
        </span>
    )
}
