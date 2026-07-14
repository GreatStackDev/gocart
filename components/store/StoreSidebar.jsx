'use client'
import { usePathname } from "next/navigation"
import {
    HomeIcon,
    LayoutListIcon,
    SquarePenIcon,
    SquarePlusIcon,
    MessageSquareIcon,
    BarChart2Icon,
    StoreIcon,
    ShareIcon,
    BadgeCheckIcon,
    TagIcon,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const StoreSidebar = ({ storeInfo }) => {
    const pathname = usePathname()

    const navGroups = [
        {
            label: "Overview",
            links: [
                { name: "Dashboard", href: "/store", icon: HomeIcon },
            ],
        },
        {
            label: "Products",
            links: [
                { name: "Add Product", href: "/store/add-product", icon: SquarePlusIcon },
                { name: "Manage Products", href: "/store/manage-product", icon: SquarePenIcon },
                { name: "Categories", href: "/store/categories", icon: TagIcon },
            ],
        },
        {
            label: "Sales",
            links: [
                { name: "Orders", href: "/store/orders", icon: LayoutListIcon },
                { name: "Analytics", href: "/store/analytics", icon: BarChart2Icon },
            ],
        },
        {
            label: "Chat",
            links: [
                { name: "Messages", href: "/store/messages", icon: MessageSquareIcon },
            ],
        },
        {
            label: "Store",
            links: [
                { name: "Store Profile", href: "/store/store-profile", icon: StoreIcon },
                { name: "Social Share", href: "/store/social-share", icon: ShareIcon },
                { name: "Get Verified", href: "/store/verification", icon: BadgeCheckIcon },
            ],
        },
    ]

    return (
        <div className="inline-flex h-full flex-col border-r border-[#E5E7EB] bg-white sm:min-w-[240px]">
            {/* Store info header — no wordmark, that's in the navbar */}
            {storeInfo && (
                <div className="px-5 py-4 border-b border-[#E5E7EB] max-sm:hidden">
                    <div className="flex items-center gap-2.5">
                        {storeInfo.logo && (
                            <Image
                                className="w-9 h-9 rounded-[8px] object-cover border border-[#E5E7EB]"
                                src={storeInfo.logo}
                                alt={storeInfo.name}
                                width={36}
                                height={36}
                            />
                        )}
                        <div>
                            <p className="text-xs font-semibold text-[#111827] truncate max-w-[140px]">{storeInfo.name}</p>
                            <p className="text-[10px] text-[#9CA3AF] capitalize">{storeInfo.plan || 'Free'} Plan</p>
                        </div>
                    </div>
                </div>
            )}

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

export default StoreSidebar