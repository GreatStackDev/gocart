'use client'
import { Suspense, useState, useMemo } from "react"
import ProductCard from "@/components/ProductCard"
import ShopSidebar from "@/components/ShopSidebar"
import { MoveLeftIcon, Filter, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSelector } from "react-redux"

function ShopContent() {
    const searchParams = useSearchParams()
    const urlSearch = searchParams.get('search') || ""
    const router = useRouter()

    const products = useSelector(state => state.product.list) || []

    // State for filters
    const [search, setSearch] = useState(urlSearch)
    const [selectedCategories, setSelectedCategories] = useState([])
    const [priceRange, setPriceRange] = useState({ min: "", max: "" })
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

    // Extract unique categories
    const categories = useMemo(() => {
        const cats = new Set()
        products.forEach(p => {
            if (p.category) cats.add(p.category.toLowerCase())
        })
        return Array.from(cats)
    }, [products])

    // Filter products
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            // Search filter
            if (search && !product.name.toLowerCase().includes(search.toLowerCase()) && !product.description.toLowerCase().includes(search.toLowerCase())) {
                return false
            }
            
            // Category filter
            if (selectedCategories.length > 0) {
                if (!product.category || !selectedCategories.includes(product.category.toLowerCase())) {
                    return false
                }
            }
            
            // Price filter
            const price = product.price
            if (priceRange.min && price < Number(priceRange.min)) return false
            if (priceRange.max && price > Number(priceRange.max)) return false
            
            return true
        })
    }, [products, search, selectedCategories, priceRange])

    const handleClearFilters = () => {
        setSearch("")
        setSelectedCategories([])
        setPriceRange({ min: "", max: "" })
    }

    return (
        <div className="min-h-[70vh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h1 onClick={() => router.push('/shop')} className="text-2xl text-slate-500 flex items-center gap-2 cursor-pointer transition-colors hover:text-slate-800">
                    <MoveLeftIcon size={20} />
                    All <span className="text-slate-800 font-medium">Products</span>
                </h1>
                
                {/* Mobile Filter Toggle */}
                <button 
                    onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                    className="lg:hidden flex items-center gap-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                >
                    <Filter size={16} />
                    Filters
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Mobile Sidebar Overlay */}
                {isMobileSidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setIsMobileSidebarOpen(false)}
                    />
                )}
                
                {/* Sidebar Container */}
                <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white overflow-y-auto transform transition-transform duration-300 lg:static lg:w-auto lg:bg-transparent lg:translate-x-0 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="p-4 lg:p-0">
                        {isMobileSidebarOpen && (
                            <div className="flex justify-between items-center mb-6 lg:hidden">
                                <span className="font-semibold text-lg">Filters</span>
                                <button onClick={() => setIsMobileSidebarOpen(false)} className="p-2 text-slate-500 hover:text-slate-800">
                                    <X size={20} />
                                </button>
                            </div>
                        )}
                        <ShopSidebar 
                            categories={categories}
                            selectedCategories={selectedCategories}
                            setSelectedCategories={setSelectedCategories}
                            priceRange={priceRange}
                            setPriceRange={setPriceRange}
                            search={search}
                            setSearch={setSearch}
                            onClearFilters={handleClearFilters}
                        />
                    </div>
                </div>

                {/* Main Product Grid */}
                <div className="flex-1">
                    <div className="mb-6 flex items-center justify-between">
                        <p className="text-sm text-slate-500">
                            Showing <span className="font-medium text-slate-800">{filteredProducts.length}</span> products
                        </p>
                    </div>
                    
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 pb-20">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-slate-50 rounded-xl border border-slate-100">
                            <h3 className="text-lg font-medium text-slate-800 mb-2">No products found</h3>
                            <p className="text-slate-500 mb-6">Try adjusting your filters or search term to find what you're looking for.</p>
                            <button 
                                onClick={handleClearFilters}
                                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function Shop() {
  return (
    <Suspense fallback={<div>Loading shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}