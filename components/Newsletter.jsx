import React from 'react'

/**
 * tradrsAvenue — Newsletter Section
 * Flat design, indigo background block.
 */
const Newsletter = () => {
    return (
        <div className="mx-6 my-16">
            <div className="max-w-2xl mx-auto bg-[#1E1B4B] rounded-[16px] px-8 py-12 text-center">
                <h2 className="font-[family-name:var(--font-heading)] font-bold text-2xl text-white">
                    Don&apos;t miss a deal
                </h2>
                <p className="text-[#A5B4FC] text-sm mt-2 max-w-md mx-auto">
                    New vendors, price drops, and local market updates — delivered to your inbox.
                </p>
                <div className="flex bg-white rounded-[8px] p-1 w-full max-w-md mx-auto mt-6">
                    <input
                        className="flex-1 pl-4 text-sm outline-none text-[#111827] placeholder-[#9CA3AF] bg-transparent"
                        type="email"
                        placeholder="Enter your email address"
                    />
                    <button
                        className="font-medium bg-[#F59E0B] text-white px-5 py-2.5 rounded-[6px] text-sm hover:bg-[#D97706] transition-all duration-150 hover:-translate-y-0.5 shrink-0"
                    >
                        Subscribe
                    </button>
                </div>
                <p className="text-[#6B7280] text-xs mt-3">No spam. Unsubscribe anytime.</p>
            </div>
        </div>
    )
}

export default Newsletter