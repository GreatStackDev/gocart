"use client";

import { PackageIcon, Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useUser, useClerk, UserButton, Show } from "@clerk/nextjs";

const Navbar = () => {
    const { user } = useUser();
    const { openSignIn } = useClerk();
    const router = useRouter();

    const [search, setSearch] = useState("");
    const cartCount = useSelector((state) => state.cart.total);

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) router.push(`/shop?search=${search}`);
    };

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB]">
            <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between gap-4">

                {/* Wordmark */}
                <Link href="/" className="flex items-center gap-1 shrink-0">
                    <span
                        className="font-[family-name:var(--font-heading)] font-bold text-[22px] tracking-tight text-[#1E1B4B]"
                    >
                        tradrs
                    </span>
                    <span
                        className="font-[family-name:var(--font-heading)] font-bold text-[22px] tracking-tight text-[#F59E0B]"
                    >
                        Avenue
                    </span>
                    <Show when={{ plan: "plus" }}>
                        <span className="ml-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#1E1B4B] text-white uppercase tracking-wide">
                            Plus
                        </span>
                    </Show>
                </Link>

                {/* Desktop nav links */}
                <div className="hidden md:flex items-center gap-6 text-sm text-[#6B7280]">
                    <Link href="/" className="hover:text-[#111827] transition-colors duration-150">Home</Link>
                    <Link href="/shop" className="hover:text-[#111827] transition-colors duration-150">Shop</Link>
                    <Link href="/pricing" className="hover:text-[#111827] transition-colors duration-150">Pricing</Link>
                </div>

                {/* Search bar — desktop */}
                <form
                    onSubmit={handleSearch}
                    className="hidden xl:flex items-center gap-2 flex-1 max-w-xs bg-[#F3F4F6] px-3.5 py-2 rounded-[8px] text-sm"
                >
                    <Search size={15} className="text-[#9CA3AF] shrink-0" />
                    <input
                        className="w-full bg-transparent outline-none placeholder-[#9CA3AF] text-[#111827]"
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </form>

                {/* Right actions */}
                <div className="flex items-center gap-3">
                    {/* Cart */}
                    <Link
                        href="/cart"
                        className="relative flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#111827] transition-colors duration-150 p-2 rounded-[8px] hover:bg-[#F3F4F6]"
                    >
                        <ShoppingCart size={18} />
                        {cartCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center text-[9px] font-bold text-white bg-[#1E1B4B] rounded-full">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Start Selling CTA — only for non-sellers */}
                    <Link
                        href="/create-store"
                        className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-[8px] bg-[#F59E0B] text-white hover:bg-[#D97706] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)]"
                    >
                        Start Selling
                    </Link>

                    {/* Auth */}
                    {!user ? (
                        <button
                            onClick={openSignIn}
                            className="px-4 py-2 text-sm font-medium rounded-[8px] border border-[#E5E7EB] bg-white text-[#111827] hover:bg-[#FAFAF7] transition-all duration-150 hover:-translate-y-0.5"
                        >
                            Sign In
                        </button>
                    ) : (
                        <UserButton>
                            <UserButton.MenuItems>
                                <UserButton.Action
                                    labelIcon={<PackageIcon size={15} />}
                                    label="My Orders"
                                    onClick={() => router.push("/orders")}
                                />
                            </UserButton.MenuItems>
                        </UserButton>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
