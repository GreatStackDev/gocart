'use client'
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Button } from "./ui/Button";

const Navbar = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartCount = useSelector((state) => state.cart.total);

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      if (search.trim()) {
        router.push(`/shop?search=${encodeURIComponent(search.trim())}`);
      }
    },
    [router, search]
  );

  return (
    <nav className="relative bg-white/95 backdrop-blur-sm shadow-sm border-b border-slate-100">
      <div className="mx-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto py-4 transition-all">
          <Link
            href="/"
            className="relative text-4xl font-semibold text-slate-700 hover:scale-[1.02] transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 rounded"
          >
            <span className="text-green-600">go</span>
            cart
            <span className="text-green-600 text-5xl leading-0">.</span>
            <p className="absolute -top-1 -right-8 px-3 p-0.5 text-xs font-semibold rounded-full flex items-center gap-2 text-white bg-green-500 shadow-sm">
              plus
            </p>
          </Link>

          {/* Mobile Menu Button */}
          <div className="sm:hidden flex items-center gap-3">
            <Link
              href="/cart"
              className="relative flex items-center text-slate-600 hover:text-green-600 transition-colors duration-200"
            >
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 flex items-center justify-center text-[10px] font-semibold text-white bg-green-500 w-4 h-4 rounded-full">
                {cartCount}
              </span>
            </Link>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-600">
            {[
              { label: "Home", href: "/" },
              { label: "Shop", href: "/shop" },
              { label: "About", href: "/" },
              { label: "Contact", href: "/" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="relative px-1 py-0.5 font-medium transition-colors duration-200 hover:text-green-600 focus-visible:text-green-600 focus:outline-none after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:scale-x-0 after:bg-green-500 after:transition-transform after:duration-200 hover:after:scale-x-100 focus-visible:after:scale-x-100"
              >
                {item.label}
              </Link>
            ))}

            <form
              onSubmit={handleSearch}
              className="hidden xl:flex items-center w-xs text-sm gap-2 bg-slate-100/80 hover:bg-slate-100 px-4 py-3 rounded-full border border-transparent focus-within:border-slate-300 focus-within:bg-white shadow-inner transition"
            >
              <Search size={18} className="text-slate-600" />
              <input
                type="text"
                className="w-full bg-transparent outline-none placeholder-slate-500"
                placeholder="Search products"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                required
              />
            </form>

            <Link
              href="/cart"
              className="group relative flex items-center gap-2 text-slate-600 hover:text-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 rounded-full px-3 py-1"
            >
              <ShoppingCart size={18} className="transition-transform duration-200 group-hover:-translate-y-0.5" />
              Cart
              <span
                className="absolute -top-1 left-3 flex items-center justify-center text-[10px] font-semibold text-white bg-green-500 w-4 h-4 rounded-full shadow-sm"
                aria-label={`Cart items: ${cartCount}`}
              >
                {cartCount}
              </span>
            </Link>

            <Button variant="gradient" size="sm" className="shadow-lg">
              Login
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`sm:hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-6 py-4 bg-white border-t border-slate-100 shadow-lg">
          <div className="flex flex-col gap-4">
            {[
              { label: "Home", href: "/" },
              { label: "Shop", href: "/shop" },
              { label: "About", href: "/" },
              { label: "Contact", href: "/" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-600 hover:text-green-600 font-medium transition-colors duration-200 py-2"
              >
                {item.label}
              </Link>
            ))}
            
            <form onSubmit={handleSearch} className="flex items-center gap-2 bg-slate-100 px-4 py-3 rounded-full mt-2">
              <Search size={18} className="text-slate-600" />
              <input
                type="text"
                className="flex-1 bg-transparent outline-none placeholder-slate-500"
                placeholder="Search products"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                required
              />
            </form>

            <Button variant="gradient" className="mt-2">
              Login
            </Button>
          </div>
        </div>
      </div>

      <hr className="border-slate-100" />
    </nav>
  );
};

export default Navbar;
