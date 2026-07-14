'use client'

import { usePathname } from "next/navigation"
import {
    HomeIcon,
    ShieldCheckIcon,
    StoreIcon,
    TicketPercentIcon,
    UsersIcon,
    PackageIcon,
    BadgeCheckIcon,
    MessageSquareIcon,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"

const AdminSidebar = () => {
    const { user } = useUser()
    const pathname = usePathname()

    if (!user) return null

    const navGroups = [
        {
            label: "Overview",
            links: [
                { name: "Dashboard", href: "/admin", icon: HomeIcon },
            ],
        },
        {
            label: "Marketplace",
            links: [
                { name: "Stores", href: "/admin/stores", icon: StoreIcon },
                { name: "Products", href: "/admin/products", icon: PackageIcon },
                { name: "Verifications & Approvals", href: "/admin/approve", icon: ShieldCheckIcon },
            ],
        },
        {
            label: "Users",
            links: [
                { name: "All Users", href: "/admin/users", icon: UsersIcon },
            ],
        },
        {
            label: "Promotions",
            links: [
                { name: "Coupons", href: "/admin/coupons", icon: TicketPercentIcon },
            ],
        },
        {
            label: "Moderation",
            links: [
                { name: "Messages", href: "/admin/messages", icon: MessageSquareIcon },
            ],
        },
    ]

    return (
        <div className="inline-flex h-full flex-col border-r border-[#E5E7EB] bg-white sm:min-w-[240px]">
            {/* Admin user header — no wordmark, that's in the navbar */}
            <div className="px-5 py-4 border-b border-[#E5E7EB] max-sm:hidden">
                <div className="flex items-center gap-2.5">
                    <Image
                        className="w-8 h-8 rounded-full"
                        src={user.imageUrl}
                        alt={user.firstName || "Admin"}
                        width={32}
                        height={32}
                    />
                    <div>
                        <p className="text-xs font-semibold text-[#111827]">{user.firstName} {user.lastName}</p>
                        <p className="text-[10px] text-[#9CA3AF]">Platform Admin</p>
                    </div>
                </div>
            </div>

            {/* Nav groups */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
                {navGroups.map((group) => (
                    <div key={group.label}>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF] px-2.5 mb-1.5 max-sm:hidden">
                            {group.label}
                        </p>
                        {group.links.map((link) => {
                            const isActive = pathname === link.href
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`relative flex items-center gap-3 px-2.5 py-2 rounded-[8px] text-sm transition-colors duration-150 mb-0.5
                                        ${isActive
                                            ? 'bg-[#EEF2FF] text-[#1E1B4B] font-medium'
                                            : 'text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#111827]'
                                        }`}
                                >
                                    <link.icon size={16} className={isActive ? 'text-[#1E1B4B]' : 'text-[#9CA3AF]'} />
                                    <span className="max-sm:hidden">{link.name}</span>
                                    {isActive && (
                                        <span className="absolute right-0 top-1.5 bottom-1.5 w-1 bg-[#1E1B4B] rounded-l" />
                                    )}
                                </Link>
                            )
                        })}
                    </div>
                ))}
            </nav>
        </div>
    )
}

export default AdminSidebar