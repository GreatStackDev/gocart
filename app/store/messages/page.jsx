'use client'

import { MessageSquareIcon } from "lucide-react"

export default function StoreMessagesPage() {
    return (
        <div className="space-y-6 h-full flex flex-col">
            <div>
                <h1 className="text-2xl font-[family-name:var(--font-heading)] font-bold text-[#1E1B4B]">
                    Messages
                </h1>
                <p className="text-sm text-[#6B7280] mt-1">Communicate directly with your buyers regarding their orders.</p>
            </div>

            <div className="flex-1 flex items-center justify-center bg-white border border-gray-100 rounded-xl min-h-[400px]">
                <div className="text-center flex flex-col items-center">
                    <MessageSquareIcon className="w-12 h-12 text-[#9CA3AF] mb-4" />
                    <h2 className="text-[#1E1B4B] font-semibold text-lg">Chat System Coming Soon</h2>
                    <p className="text-[#6B7280] mt-1 text-sm max-w-sm">
                        The real-time messaging system is currently under development. You will soon be able to chat directly with buyers here.
                    </p>
                </div>
            </div>
        </div>
    )
}
