'use client'
import { Suspense, useState } from "react"
import ProductCard from "@/components/ProductCard"
import { MoveLeftIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSelector } from "react-redux"

function ShopContent() {

    const searchParams = useSearchParams()
    const search = searchParams.get('search')
    const router = useRouter()
    const products = useSelector(state => state.product.list)
    const [minPrice, setMinPrice] = useState(0)
    const [maxPrice, setMaxPrice] = useState(999999)
    const [inStockOnly, setInStockOnly] = useState(false)
    const [proximity, setProximity] = useState(100)
    const [category, setCategory] = useState("all")

    let filteredProducts = search
        ? products.filter(product =>
            product.name.toLowerCase().includes(search.toLowerCase())
        )
        : products

    filteredProducts = filteredProducts.filter(p =>
        p.price >= minPrice &&
        p.price <= maxPrice &&
        (inStockOnly ? p.inStock === true : true) &&
        (category === "all" ? true : p.category === category)
    )

    return (
        <div className="min-h-[70vh] mx-6">
            <div className="max-w-7xl mx-auto flex gap-10">

                {/* LEFT: PRODUCT GRID */}
                <div className="w-full">
                    <h1
                        onClick={() => router.push('/shop')}
                        className="text-2xl text-slate-500 my-6 flex items-center gap-2 cursor-pointer"
                    >
                        {search && <MoveLeftIcon size={20} />}
                        All <span className="text-slate-700 font-medium">Products</span>
                    </h1>

                    <div className="grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12 mb-32">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>

                {/* RIGHT: FILTER PANEL - moved further down */}
                <div className="w-[260px] xl:block sticky top-[150px] h-fit p-2 border border-slate-200 rounded">
                    <h2 className="text-lg font-semibold mb-4 text-slate-700">
                        Filters
                    </h2>

                    {/* PRICE FILTER */}
                    <div className="mb-6">
                        <h3 className="font-medium text-slate-600">Price</h3>
                        <div className="flex items-center gap-2 mt-2">
                            <input
                                type="number"
                                className="border p-1 rounded w-full"
                                placeholder="Min"
                                value={minPrice}
                                onChange={(e) => setMinPrice(Number(e.target.value))}
                            />
                            <span>-</span>
                            <input
                                type="number"
                                className="border p-1 rounded w-full"
                                placeholder="Max"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    {/* STOCK FILTER */}
                    <div className="mb-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={inStockOnly}
                                onChange={() => setInStockOnly(!inStockOnly)}
                            />
                            <span className="text-slate-600">In Stock Only</span>
                        </label>
                    </div>

                    {/* PROXIMITY FILTER */}
                    <div className="mb-6">
                        <h3 className="font-medium text-slate-600">Proximity (km)</h3>
                        <input
                            type="range"
                            min="1"
                            max="100"
                            value={proximity}
                            onChange={(e) => setProximity(Number(e.target.value))}
                            className="w-full mt-2"
                        />
                        <p className="text-sm text-slate-500">{proximity} km</p>
                    </div>

                    {/* CATEGORY FILTER */}
                    <div className="mb-6">
                        <h3 className="font-medium text-slate-600">Category</h3>
                        <select
                            className="border p-2 rounded w-full mt-2"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="watches">Watches</option>
                            <option value="speakers-headphones">Speakers & Headphones</option>
                            <option value="home">Home</option>
                        </select>
                    </div>

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