'use client'

import { MessageSquareIcon } from "lucide-react"

export default function AdminMessagesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-[family-name:var(--font-heading)] font-bold text-[#1E1B4B]">
                    Platform Messages
                </h1>
                <p className="text-sm text-[#6B7280] mt-1">Monitor all in-app communications between buyers and sellers.</p>
            </div>

            <div className="flex flex-col items-center justify-center h-80 bg-white border border-gray-100 rounded-xl">
                <MessageSquareIcon className="w-12 h-12 text-[#9CA3AF] mb-4" />
                <h2 className="text-[#1E1B4B] font-semibold text-lg">Global Message Log</h2>
                <p className="text-[#6B7280] mt-1 text-sm text-center max-w-sm">
                    The messaging system is currently under development. Global message logging will be available in a future update.
                </p>
            </div>
        </div>
    )
}
