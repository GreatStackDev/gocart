'use client'

import { TagIcon, PlusIcon } from "lucide-react"

export default function StoreCategoriesPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-[family-name:var(--font-heading)] font-bold text-[#1E1B4B]">
                        Store Categories
                    </h1>
                    <p className="text-sm text-[#6B7280] mt-1">Manage custom categories for your store products.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#1E1B4B] text-white rounded-lg text-sm hover:bg-[#312E81] transition-colors">
                    <PlusIcon className="w-4 h-4" /> Add Category
                </button>
            </div>

            <div className="flex flex-col items-center justify-center h-80 bg-white border border-gray-100 rounded-xl">
                <TagIcon className="w-12 h-12 text-[#9CA3AF] mb-4" />
                <h2 className="text-[#1E1B4B] font-semibold text-lg">No Custom Categories</h2>
                <p className="text-[#6B7280] mt-1 text-sm text-center max-w-sm">
                    You haven't created any custom categories yet. Click the "Add Category" button to get started.
                </p>
            </div>
        </div>
    )
}
