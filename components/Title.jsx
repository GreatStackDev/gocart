'use client'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

/**
 * tradrsAvenue — Section Title
 * Used as a section header across the homepage.
 */
const Title = ({ title, description, visibleButton = true, href = '' }) => {
    return (
        <div className="flex flex-col items-center text-center">
            <h2 className="font-[family-name:var(--font-heading)] font-bold text-2xl text-[#111827]">
                {title}
            </h2>
            <div className="flex items-center gap-4 mt-2">
                <p className="max-w-lg text-sm text-[#6B7280]">{description}</p>
                {visibleButton && (
                    <Link
                        href={href}
                        className="shrink-0 text-sm font-medium text-[#1E1B4B] flex items-center gap-1 hover:gap-2 transition-all duration-150"
                    >
                        View more <ArrowRight size={14} />
                    </Link>
                )}
            </div>
        </div>
    )
}

export default Title