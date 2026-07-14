'use client'

import { useEffect, useState, useMemo } from "react"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"
import Image from "next/image"
import toast from "react-hot-toast"
import { SearchIcon, UsersIcon, StoreIcon, ShoppingBagIcon } from "lucide-react"
import Badge from "@/components/ui/Badge"
import Link from "next/link"

export default function AdminUsersPage() {
    const { getToken } = useAuth()

    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")

    const fetchUsers = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get("/api/admin/users", {
                headers: { Authorization: `Bearer ${token}` },
            })
            setUsers(data.users)
        } catch (error) {
            toast.error(error?.response?.data?.error || "Failed to load users")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchUsers() }, [])

    const filtered = useMemo(() => {
        if (!search.trim()) return users
        const q = search.toLowerCase()
        return users.filter(u =>
            u.name?.toLowerCase().includes(q) ||
            u.email?.toLowerCase().includes(q)
        )
    }, [users, search])

    // Summary stats
    const totalWithStore = users.filter(u => u.store).length
    const totalWithoutStore = users.length - totalWithStore

    return (
        <div className="pb-20">
            {/* Page header */}
            <div className="mb-8">
                <h1 className="font-[family-name:var(--font-heading)] font-bold text-2xl text-[#111827]">
                    User Management
                </h1>
                <p className="text-sm text-[#6B7280] mt-1">
                    View and manage all registered users on the platform.
                </p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                    { label: "Total Users", value: loading ? "—" : users.length, icon: UsersIcon, accent: "#EEF2FF", color: "#1E1B4B" },
                    { label: "Sellers", value: loading ? "—" : totalWithStore, icon: StoreIcon, accent: "#FEF3C7", color: "#92400E" },
                    { label: "Buyers only", value: loading ? "—" : totalWithoutStore, icon: ShoppingBagIcon, accent: "#F0FDF4", color: "#065F46" },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white border border-[#E5E7EB] rounded-[12px] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)] flex items-center justify-between gap-3">
                        <div>
                            <p className="text-xs text-[#6B7280] font-medium uppercase tracking-wider">{stat.label}</p>
                            <p className="font-[family-name:var(--font-heading)] font-bold text-2xl text-[#111827] mt-0.5">{stat.value}</p>
                        </div>
                        <div className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0" style={{ backgroundColor: stat.accent }}>
                            <stat.icon size={18} style={{ color: stat.color }} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Table card */}
            <div className="bg-white border border-[#E5E7EB] rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
                {/* Toolbar */}
                <div className="px-5 py-4 border-b border-[#F3F4F6] flex items-center gap-3">
                    <div className="relative flex-1 max-w-sm">
                        <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                        <input
                            type="text"
                            placeholder="Search by name or email…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-8 pr-3 py-2 text-sm border border-[#E5E7EB] rounded-[8px] text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#1E1B4B] transition-colors"
                        />
                    </div>
                    {search && (
                        <span className="text-xs text-[#6B7280]">
                            {filtered.length} of {users.length}
                        </span>
                    )}
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[#F3F4F6]">
                                {["User", "Store", "Plan", "Orders", "Reviews"].map(h => (
                                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider first:pl-5">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F9FAFB]">
                            {loading ? (
                                /* Skeleton rows */
                                Array(6).fill(null).map((_, i) => (
                                    <tr key={i}>
                                        {Array(5).fill(null).map((_, j) => (
                                            <td key={j} className="px-5 py-4">
                                                <div className="h-4 bg-[#F3F4F6] rounded animate-pulse" style={{ width: j === 0 ? "160px" : "80px" }} />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-5 py-16 text-center">
                                        <UsersIcon size={32} className="mx-auto text-[#E5E7EB] mb-3" />
                                        <p className="text-sm text-[#9CA3AF]">
                                            {search ? "No users match your search." : "No users found."}
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((user) => (
                                    <tr key={user.id} className="hover:bg-[#FAFAF9] transition-colors">
                                        {/* User */}
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <Image
                                                    src={user.image}
                                                    alt={user.name}
                                                    width={32}
                                                    height={32}
                                                    className="w-8 h-8 rounded-full object-cover shrink-0 border border-[#E5E7EB]"
                                                />
                                                <div className="min-w-0">
                                                    <p className="font-medium text-[#111827] truncate max-w-[180px]">{user.name}</p>
                                                    <p className="text-xs text-[#9CA3AF] truncate max-w-[180px]">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Store */}
                                        <td className="px-5 py-3.5">
                                            {user.store ? (
                                                <Link
                                                    href={`/shop/${user.store.username}`}
                                                    className="text-[#1E1B4B] font-medium hover:underline text-sm"
                                                    target="_blank"
                                                >
                                                    {user.store.name}
                                                </Link>
                                            ) : (
                                                <span className="text-xs text-[#D1D5DB]">—</span>
                                            )}
                                        </td>

                                        {/* Plan */}
                                        <td className="px-5 py-3.5">
                                            {user.store ? (
                                                <Badge variant={user.store.plan === "pro" ? "pro" : "neutral"}>
                                                    {user.store.plan === "pro" ? "Pro" : "Free"}
                                                </Badge>
                                            ) : (
                                                <span className="text-xs text-[#D1D5DB]">—</span>
                                            )}
                                        </td>

                                        {/* Orders */}
                                        <td className="px-5 py-3.5">
                                            <span className="text-[#374151] font-medium tabular-nums">
                                                {user._count.buyerOrders}
                                            </span>
                                        </td>

                                        {/* Reviews */}
                                        <td className="px-5 py-3.5">
                                            <span className="text-[#374151] tabular-nums">
                                                {user._count.ratings}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer count */}
                {!loading && filtered.length > 0 && (
                    <div className="px-5 py-3 border-t border-[#F3F4F6]">
                        <p className="text-xs text-[#9CA3AF]">
                            Showing {filtered.length} {filtered.length === 1 ? "user" : "users"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
