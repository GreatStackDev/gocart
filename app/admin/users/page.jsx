'use client'

import { UsersIcon } from "lucide-react"

export default function AdminUsersPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-[family-name:var(--font-heading)] font-bold text-[#1E1B4B]">
                    User Management
                </h1>
                <p className="text-sm text-[#6B7280] mt-1">View and manage all registered users on the platform.</p>
            </div>

            <div className="flex flex-col items-center justify-center h-80 bg-white border border-gray-100 rounded-xl">
                <UsersIcon className="w-12 h-12 text-[#9CA3AF] mb-4" />
                <h2 className="text-[#1E1B4B] font-semibold text-lg">Coming Soon</h2>
                <p className="text-[#6B7280] mt-1 text-sm text-center max-w-sm">
                    The detailed user management dashboard is currently under development.
                </p>
            </div>
        </div>
    )
}
