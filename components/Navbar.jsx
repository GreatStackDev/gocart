'use client'
import { Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";

import Logo from "@/components/Logo";

const Navbar = () => {

    const router = useRouter();

    const [search, setSearch] = useState('')
    const cartCount = useSelector(state => state.cart.total)

    const handleSearch = (e) => {
        e.preventDefault()
        router.push(`/shop?search=${search}`)
    }

    return (
        <nav className="relative bg-white">
            <div className="mx-6">
                <div className="flex items-center justify-between max-w-7xl mx-auto py-4  transition-all">

                    <Logo badge="plus" />

                    {/* Desktop Menu */}
                    <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-600">
                        <Link href="/" className="hover:text-orange-600 transition-colors hover:bg-orange-200/30 py-1.5 px-4 rounded-full">Home</Link>
                        <Link href="/shop" className="hover:text-orange-600 transition-colors hover:bg-orange-200/30 py-1.5 px-4 rounded-full">Shop</Link>
                        <Link href="/" className="hover:text-orange-600 transition-colors hover:bg-orange-200/30 py-1.5 px-4 rounded-full">About</Link>
                        <Link href="/" className="hover:text-orange-600 transition-colors hover:bg-orange-200/30 py-1.5 px-4 rounded-full">Contact</Link>

                        <form onSubmit={handleSearch} className="hidden xl:flex items-center w-xs text-sm gap-2 bg-slate-100 px-4 py-3 rounded-full">
                            <Search size={18} className="text-slate-600" />
                            <input className="w-full bg-transparent outline-none placeholder-slate-600" type="text" placeholder="Search products" value={search} onChange={(e) => setSearch(e.target.value)} required />
                        </form>

                        <Link href="/cart" className="relative flex items-center gap-2 text-slate-600">
                            <ShoppingCart size={18} />
                            Cart
                            <button className="absolute -top-1 left-3 text-[8px] text-white bg-slate-600 size-3.5 rounded-full">{cartCount}</button>
                        </Link>

                        <button className="px-8 py-2 bg-orange-600 hover:bg-orange-400 transition text-white rounded-full">
                            Login
                        </button>

                    </div>

                    {/* Mobile User Button  */}
                    <div className="sm:hidden">
                        <button className="px-7 py-1.5 bg-orange-500 hover:bg-orange-400 text-sm transition text-white rounded-full">
                            Login
                        </button>
                    </div>
                </div>
            </div>
            <hr className="border-gray-300" />
        </nav>
    )
}

export default Navbar