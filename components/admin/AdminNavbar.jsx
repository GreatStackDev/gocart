'use client'
import { UserButton, useUser } from "@clerk/nextjs"
import Link from "next/link"

const AdminNavbar = () => {
    const { user } = useUser()

    return (
        <div className="flex items-center justify-between px-6 sm:px-10 py-3.5 border-b border-[#E5E7EB] bg-white">
            {/* Wordmark */}
            <Link href="/" className="flex items-center gap-1 shrink-0">
                <span className="font-[family-name:var(--font-heading)] font-bold text-[20px] tracking-tight text-[#1E1B4B]">
                    tradrs
                </span>
                <span className="font-[family-name:var(--font-heading)] font-bold text-[20px] tracking-tight text-[#F59E0B]">
                    Avenue
                </span>
                <span className="ml-1.5 text-[9px] font-semibold px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] uppercase tracking-wide border border-[#FCD34D]">
                    Admin
                </span>
            </Link>

            {/* Right */}
            <div className="flex items-center gap-3">
                {user?.firstName && (
                    <span className="hidden sm:block text-sm text-[#6B7280]">
                        Hi, <span className="font-medium text-[#111827]">{user.firstName}</span>
                    </span>
                )}
                <UserButton />
            </div>
        </div>
    )
}

export default AdminNavbar