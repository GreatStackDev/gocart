'use client'
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Link from 'next/link'
import Image from 'next/image'
import ProductCard from './ProductCard'
import { addToCart } from '@/lib/features/cart/cartSlice'
import { ArrowRight, Check, Flame, Heart, ShieldCheck, ShoppingBag, Sparkles, Star, Tag, Truck, Zap } from 'lucide-react'
import toast from 'react-hot-toast'

const BestSelling = () => {
    const dispatch = useDispatch()
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    const products = useSelector(state => state.product.list)
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [addedIds, setAddedIds] = useState({})
    const [wishlistedIds, setWishlistedIds] = useState({})

    // Sort products by popularity (review count)
    const sortedProducts = products.slice().sort((a, b) => b.rating.length - a.rating.length)

    // Extract unique categories
    const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))]

    // Filtered list
    const filteredProducts = selectedCategory === 'All'
        ? sortedProducts
        : sortedProducts.filter(p => p.category === selectedCategory)

    // Rating helper
    const getRating = (prod) => {
        const count = prod?.rating?.length || 0
        const avg = count > 0 ? prod.rating.reduce((a, c) => a + (c.rating || 0), 0) / count : 5
        return { avg, count }
    }

    // Discount helper
    const getDiscount = (prod) => {
        if (prod?.mrp && prod.mrp > prod.price) {
            return Math.round(((prod.mrp - prod.price) / prod.mrp) * 100)
        }
        return 0
    }

    // 1-Click Add to Cart
    const handleAddToCart = (e, prod) => {
        e.preventDefault()
        e.stopPropagation()
        if (!prod) return

        dispatch(addToCart({ productId: prod.id }))
        setAddedIds(prev => ({ ...prev, [prod.id]: true }))
        toast.success(`${prod.name} added to cart!`, {
            icon: '🛍️',
            style: {
                borderRadius: '12px',
                background: '#1e293b',
                color: '#fff',
                fontSize: '13px',
            }
        })
        setTimeout(() => {
            setAddedIds(prev => ({ ...prev, [prod.id]: false }))
        }, 1200)
    }

    // Wishlist Toggle
    const handleWishlistToggle = (e, prod) => {
        e.preventDefault()
        e.stopPropagation()
        const nextState = !wishlistedIds[prod.id]
        setWishlistedIds(prev => ({ ...prev, [prod.id]: nextState }))
        toast(nextState ? 'Saved to wishlist!' : 'Removed from wishlist', {
            icon: nextState ? '❤️' : '🤍',
            style: {
                borderRadius: '12px',
                background: '#1e293b',
                color: '#fff',
                fontSize: '13px',
            }
        })
    }

    if (!products || products.length === 0) {
        return null
    }

    // 6 Products for the exact 6 Bento slots
    const p1 = sortedProducts[0] || products[0]
    const p2 = sortedProducts[1] || products[1]
    const p3 = sortedProducts[2] || products[2]
    const p4 = sortedProducts[3] || products[3]
    const p5 = sortedProducts[4] || products[4]
    const p6 = sortedProducts[5] || products[5]

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16 sm:my-24">
            {/* Section Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-12">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-600 mb-3">
                        <Sparkles size={14} className="fill-orange-600" />
                        <span>Curated Bento Collection</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Best Selling <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">Products</span>
                    </h2>
                    <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-xl">
                        Explore our top trending items organized in a modern bento showcase.
                    </p>
                </div>

                {/* Categories & View All Link */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl">
                        {categories.slice(0, 5).map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${selectedCategory === cat
                                    ? 'bg-white text-orange-600 shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <Link
                        href="/shop"
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-xl transition-all"
                    >
                        View all <ArrowRight size={15} />
                    </Link>
                </div>
            </div>

            {/* Bento Grid (when 'All' is active) */}
            {selectedCategory === 'All' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* 1. TALL LEFT CARD (col-span-1 row-span-2) - "Smart Picks" */}
                    {p1 && (
                        <Link
                            href={`/product/${p1.id}`}
                            className="md:col-span-1 md:row-span-2 relative bg-white rounded-xl border border-slate-200 p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:shadow-xl hover:border-orange-200/80 transition-all duration-300 group overflow-hidden min-h-[480px]"
                        >
                            {/* Header */}
                            <div>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                                        Smart Picks
                                    </h3>
                                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs">
                                        #1 Popular
                                    </span>
                                </div>
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">
                                    {p1.category}
                                </p>
                            </div>

                            {/* Centered Image with ambient light */}
                            <div className="relative my-auto py-6 flex items-center justify-center">
                                <div className="absolute size-44 rounded-full bg-orange-100/40 blur-2xl pointer-events-none group-hover:bg-orange-200/50 transition-all" />
                                <Image
                                    src={p1.images[0]}
                                    alt={p1.name}
                                    width={400}
                                    height={400}
                                    className="max-h-52 w-auto object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-500 ease-out"
                                />
                            </div>

                            {/* Footer Content */}
                            <div>
                                <div className="flex items-center gap-1.5 mb-1.5">
                                    <Star size={13} className="text-transparent fill-amber-400" />
                                    <span className="text-xs font-bold text-slate-700">{getRating(p1).avg.toFixed(1)}</span>
                                    <span className="text-[11px] text-slate-400">({getRating(p1).count} reviews)</span>
                                </div>
                                <h4 className="font-semibold text-slate-800 text-sm line-clamp-1 mb-3">
                                    {p1.name}
                                </h4>

                                <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                                    <div>
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="text-xl font-extrabold text-slate-900">{currency}{p1.price}</span>
                                            {p1.mrp > p1.price && (
                                                <span className="text-xs text-slate-400 line-through">{currency}{p1.mrp}</span>
                                            )}
                                        </div>
                                        <p className="text-[11px] text-slate-400">Find the right product faster</p>
                                    </div>
                                    <button
                                        onClick={(e) => handleAddToCart(e, p1)}
                                        type="button"
                                        className={`size-10 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-90 shadow-sm cursor-pointer ${addedIds[p1.id]
                                            ? 'bg-emerald-600 text-white shadow-emerald-500/25 scale-105'
                                            : 'bg-slate-900 hover:bg-orange-600 text-white hover:shadow-md hover:shadow-orange-500/25'
                                            }`}
                                    >
                                        {addedIds[p1.id] ? <Check size={17} strokeWidth={2.5} /> : <ShoppingBag size={16} />}
                                    </button>
                                </div>
                            </div>
                        </Link>
                    )}

                    {/* 2. WIDE TOP RIGHT CARD (col-span-2) - "Fast Checkout" */}
                    {p2 && (
                        <Link
                            href={`/product/${p2.id}`}
                            className="md:col-span-2 relative bg-white rounded-xl border border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs hover:shadow-xl hover:border-orange-200/80 transition-all duration-300 group overflow-hidden min-h-[220px]"
                        >
                            {/* Left Text */}
                            <div className="flex-1 max-w-sm">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-600 mb-2">
                                    <Zap size={11} className="fill-orange-600" />
                                    Fast Checkout
                                </span>
                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                                    {p2.name}
                                </h3>
                                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                                    Smooth payment experiences with fewer steps and instant express confirmation.
                                </p>

                                <div className="flex items-center gap-3 mt-4">
                                    <div>
                                        <span className="text-2xl font-extrabold text-slate-900">{currency}{p2.price}</span>
                                        {p2.mrp > p2.price && (
                                            <span className="text-xs text-slate-400 line-through ml-2">{currency}{p2.mrp}</span>
                                        )}
                                    </div>
                                    <button
                                        onClick={(e) => handleAddToCart(e, p2)}
                                        type="button"
                                        className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer ${addedIds[p2.id]
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-slate-900 hover:bg-orange-600 text-white'
                                            }`}
                                    >
                                        {addedIds[p2.id] ? <Check size={14} /> : <ShoppingBag size={14} />}
                                        {addedIds[p2.id] ? 'Added' : 'Add to Cart'}
                                    </button>
                                </div>
                            </div>

                            {/* Right Image */}
                            <div className="relative shrink-0 flex items-center justify-center size-36 sm:size-44">
                                <div className="absolute inset-0 bg-orange-100/40 rounded-full blur-xl group-hover:bg-orange-200/50 transition-all pointer-events-none" />
                                <Image
                                    src={p2.images[0]}
                                    alt={p2.name}
                                    width={300}
                                    height={300}
                                    className="max-h-36 sm:max-h-40 w-auto object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-500 ease-out"
                                />
                            </div>
                        </Link>
                    )}

                    {/* 3. MIDDLE SQUARE LEFT (col-span-1) - "Best Deals" */}
                    {p3 && (
                        <Link
                            href={`/product/${p3.id}`}
                            className="md:col-span-1 relative bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:shadow-xl hover:border-orange-200/80 transition-all duration-300 group overflow-hidden min-h-[220px]"
                        >
                            {/* Top info */}
                            <div>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                                        Best Deals
                                    </h3>
                                    {getDiscount(p3) > 0 && (
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white">
                                            {getDiscount(p3)}% OFF
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-slate-500 mt-1 line-clamp-1">{p3.name}</p>
                            </div>

                            {/* Bottom row with price and corner image */}
                            <div className="flex items-end justify-between mt-4">
                                <div>
                                    <div className="text-lg font-extrabold text-slate-900">{currency}{p3.price}</div>
                                    <button
                                        onClick={(e) => handleAddToCart(e, p3)}
                                        type="button"
                                        className={`mt-2 size-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${addedIds[p3.id] ? 'bg-emerald-600 text-white' : 'bg-slate-900 hover:bg-orange-600 text-white'
                                            }`}
                                    >
                                        {addedIds[p3.id] ? <Check size={14} /> : <ShoppingBag size={14} />}
                                    </button>
                                </div>

                                {/* Floating image at bottom right (like the % tag in reference) */}
                                <div className="relative size-24 shrink-0 flex items-center justify-center">
                                    <Image
                                        src={p3.images[0]}
                                        alt={p3.name}
                                        width={200}
                                        height={200}
                                        className="max-h-24 w-auto object-contain drop-shadow-md group-hover:scale-115 transition-transform duration-500 ease-out"
                                    />
                                </div>
                            </div>
                        </Link>
                    )}

                    {/* 4. MIDDLE SQUARE RIGHT (col-span-1) - "Wishlist Favorite" */}
                    {p4 && (
                        <Link
                            href={`/product/${p4.id}`}
                            className="md:col-span-1 relative bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:shadow-xl hover:border-orange-200/80 transition-all duration-300 group overflow-hidden min-h-[220px]"
                        >
                            {/* Top info with wishlist button */}
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                                        Wishlist
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{p4.name}</p>
                                </div>
                                <button
                                    onClick={(e) => handleWishlistToggle(e, p4)}
                                    type="button"
                                    className="size-8 rounded-full bg-slate-50 hover:bg-rose-50 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                                    aria-label="Wishlist"
                                >
                                    <Heart
                                        size={15}
                                        fill={wishlistedIds[p4.id] ? '#f43f5e' : 'transparent'}
                                        className={wishlistedIds[p4.id] ? 'text-rose-500' : 'text-slate-400'}
                                    />
                                </button>
                            </div>

                            {/* Floating image in middle/right */}
                            <div className="my-2 flex items-center justify-center">
                                <Image
                                    src={p4.images[0]}
                                    alt={p4.name}
                                    width={200}
                                    height={200}
                                    className="max-h-24 w-auto object-contain drop-shadow-md group-hover:scale-115 transition-transform duration-500 ease-out"
                                />
                            </div>

                            {/* Bottom row */}
                            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                                <span className="text-base font-extrabold text-slate-900">{currency}{p4.price}</span>
                                <button
                                    onClick={(e) => handleAddToCart(e, p4)}
                                    type="button"
                                    className={`size-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${addedIds[p4.id] ? 'bg-emerald-600 text-white' : 'bg-slate-900 hover:bg-orange-600 text-white'
                                        }`}
                                >
                                    {addedIds[p4.id] ? <Check size={14} /> : <ShoppingBag size={14} />}
                                </button>
                            </div>
                        </Link>
                    )}

                    {/* 5. WIDE BOTTOM LEFT CARD (col-span-2) - "Secure Pay" */}
                    {p5 && (
                        <Link
                            href={`/product/${p5.id}`}
                            className="md:col-span-2 relative bg-white rounded-xl border border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs hover:shadow-xl hover:border-orange-200/80 transition-all duration-300 group overflow-hidden min-h-[220px]"
                        >
                            {/* Left Text */}
                            <div className="flex-1 max-w-sm">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 mb-2">
                                    <ShieldCheck size={12} className="text-emerald-600" />
                                    Secure Pay & Warranty
                                </span>
                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                                    {p5.name}
                                </h3>
                                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                                    Protected payment methods and 1-year verified guarantee built for safe shopping.
                                </p>

                                <div className="flex items-center gap-3 mt-4">
                                    <div>
                                        <span className="text-2xl font-extrabold text-slate-900">{currency}{p5.price}</span>
                                        {p5.mrp > p5.price && (
                                            <span className="text-xs text-slate-400 line-through ml-2">{currency}{p5.mrp}</span>
                                        )}
                                    </div>
                                    <button
                                        onClick={(e) => handleAddToCart(e, p5)}
                                        type="button"
                                        className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer ${addedIds[p5.id]
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-slate-900 hover:bg-orange-600 text-white'
                                            }`}
                                    >
                                        {addedIds[p5.id] ? <Check size={14} /> : <ShoppingBag size={14} />}
                                        {addedIds[p5.id] ? 'Added' : 'Add to Cart'}
                                    </button>
                                </div>
                            </div>

                            {/* Right Image */}
                            <div className="relative shrink-0 flex items-center justify-center size-36 sm:size-44">
                                <div className="absolute inset-0 bg-emerald-100/30 rounded-full blur-xl group-hover:bg-emerald-200/40 transition-all pointer-events-none" />
                                <Image
                                    src={p5.images[0]}
                                    alt={p5.name}
                                    width={300}
                                    height={300}
                                    className="max-h-36 sm:max-h-40 w-auto object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-500 ease-out"
                                />
                            </div>
                        </Link>
                    )}

                    {/* 6. BOTTOM RIGHT SQUARE (col-span-1) - "Rewards" */}
                    {p6 && (
                        <Link
                            href={`/product/${p6.id}`}
                            className="md:col-span-1 relative bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:shadow-xl hover:border-orange-200/80 transition-all duration-300 group overflow-hidden min-h-[220px]"
                        >
                            {/* Top info */}
                            <div>
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full mb-1">
                                    <Tag size={10} /> Exclusive
                                </span>
                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors mt-1">
                                    Rewards
                                </h3>
                                <p className="text-xs text-slate-500 mt-1 line-clamp-1">{p6.name}</p>
                            </div>

                            {/* Centered Image */}
                            <div className="my-2 flex items-center justify-center">
                                <Image
                                    src={p6.images[0]}
                                    alt={p6.name}
                                    width={200}
                                    height={200}
                                    className="max-h-24 w-auto object-contain drop-shadow-md group-hover:scale-115 transition-transform duration-500 ease-out"
                                />
                            </div>

                            {/* Bottom row */}
                            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                                <span className="text-base font-extrabold text-slate-900">{currency}{p6.price}</span>
                                <button
                                    onClick={(e) => handleAddToCart(e, p6)}
                                    type="button"
                                    className={`size-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${addedIds[p6.id] ? 'bg-emerald-600 text-white' : 'bg-slate-900 hover:bg-orange-600 text-white'
                                        }`}
                                >
                                    {addedIds[p6.id] ? <Check size={14} /> : <ShoppingBag size={14} />}
                                </button>
                            </div>
                        </Link>
                    )}

                </div>
            ) : (
                /* Category Filtered Grid */
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {filteredProducts.map((product, index) => (
                        <ProductCard key={product.id || index} product={product} />
                    ))}
                </div>
            )}
        </section>
    )
}

export default BestSelling