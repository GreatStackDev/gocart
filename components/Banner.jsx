'use client'
import React from 'react'
import toast from 'react-hot-toast'
import { XIcon } from 'lucide-react'

/**
 * tradrsAvenue — Announcement Banner
 * Flat indigo background. No gradient.
 */
export default function Banner() {
    const [isOpen, setIsOpen] = React.useState(true)

    const handleClaim = () => {
        setIsOpen(false)
        navigator.clipboard.writeText('FIRST20')
        toast.success('Coupon code FIRST20 copied!')
    }

    if (!isOpen) return null

    return (
        <div className="w-full px-6 py-2 bg-[#1E1B4B] text-white text-sm font-medium">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                <p className="text-[#A5B4FC] text-xs hidden sm:block">tradrsAvenue — South Africa&apos;s local marketplace</p>
                <p className="text-center flex-1 sm:flex-none">
                    Get <span className="text-[#F59E0B] font-bold">20% OFF</span> your first order — use code{' '}
                    <span className="font-bold tracking-wide">FIRST20</span>
                </p>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleClaim}
                        className="max-sm:hidden text-xs font-semibold px-4 py-1.5 bg-[#F59E0B] text-white rounded-[6px] hover:bg-[#D97706] transition-colors duration-150"
                    >
                        Copy Code
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        aria-label="Close banner"
                        className="text-[#A5B4FC] hover:text-white transition-colors duration-150"
                    >
                        <XIcon size={14} />
                    </button>
                </div>
            </div>
        </div>
    )
}