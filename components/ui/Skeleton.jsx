/**
 * tradrsAvenue — Skeleton primitive
 * Flat grey placeholder — replaces spinners.
 * No animation (respects SA low-data users).
 */

import React from 'react'

export function Skeleton({ className = '', ...props }) {
    return (
        <div
            className={`bg-[#F3F4F6] rounded-[8px] ${className}`}
            {...props}
        />
    )
}

export function SkeletonCard() {
    return (
        <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-4 space-y-3">
            <Skeleton className="h-44 w-full rounded-[8px]" />
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <div className="flex justify-between items-center pt-1">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-8 w-20 rounded-[8px]" />
            </div>
        </div>
    )
}

export function SkeletonText({ lines = 3, className = '' }) {
    return (
        <div className={`space-y-2 ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    className={`h-3 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
                />
            ))}
        </div>
    )
}
