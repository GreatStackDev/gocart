'use client'
import React, { useState } from 'react'
import { Check, Heart, ShoppingBag, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useDispatch } from 'react-redux'
import { addToCart } from '@/lib/features/cart/cartSlice'
import toast from 'react-hot-toast'

const ProductCard = ({ product }) => {
    const dispatch = useDispatch()
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    const [isWishlisted, setIsWishlisted] = useState(false)
    const [isAdded, setIsAdded] = useState(false)

    // Calculate rating metrics
    const ratingCount = product.rating?.length || 0
    const avgRating = ratingCount > 0
        ? product.rating.reduce((acc, curr) => acc + (curr.rating || 0), 0) / ratingCount
        : 5

    // Calculate discount percentage
    const discountPercent = product.mrp && product.mrp > product.price
        ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
        : 0

    const handleAddToCart = (e) => {
        e.preventDefault()
        e.stopPropagation()
        dispatch(addToCart({ productId: product.id }))
        setIsAdded(true)
        toast.success(`${product.name} added to cart!`, {
            icon: '🛍️',
            style: {
                borderRadius: '12px',
                background: '#1e293b',
                color: '#fff',
                fontSize: '13px',
            }
        })
        setTimeout(() => setIsAdded(false), 1200)
    }

    const handleWishlistToggle = (e) => {
        e.preventDefault()
        e.stopPropagation()
        const nextState = !isWishlisted
        setIsWishlisted(nextState)
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

    return (
        <Link
            href={`/product/${product.id}`}
            className="group relative flex flex-col w-full h-full bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-xl hover:shadow-slate-200/50 hover:border-orange-200/70 transition-all duration-300 hover:-translate-y-1.5 overflow-hidden select-none"
        >
            {/* Image Showcase Area */}
            <div className="relative aspect-square w-full bg-gradient-to-b from-slate-50 to-slate-100/60 flex items-center justify-center p-5 overflow-hidden">
                {/* Discount Badge */}
                <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
                    {discountPercent > 0 ? (
                        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs">
                            {discountPercent}% OFF
                        </span>
                    ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-slate-600 border border-slate-200/60 shadow-2xs">
                            {product.category}
                        </span>
                    )}
                </div>

                {/* Wishlist Button */}
                <button
                    onClick={handleWishlistToggle}
                    type="button"
                    className="absolute top-2.5 right-2.5 z-10 size-8 rounded-full bg-white/90 backdrop-blur-xs shadow-xs border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                    aria-label="Wishlist"
                >
                    <Heart
                        size={15}
                        fill={isWishlisted ? "#f43f5e" : "transparent"}
                        className={isWishlisted ? "text-rose-500" : "text-slate-400 hover:text-rose-500"}
                    />
                </button>

                {/* Product Image */}
                <Image
                    width={500}
                    height={500}
                    className="max-h-36 sm:max-h-44 w-auto object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-500 ease-out"
                    src={product.images[0]}
                    alt={product.name}
                />
            </div>

            {/* Card Body */}
            <div className="flex flex-col flex-1 p-3.5 sm:p-4">
                {/* Category & Stock Status */}
                <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 mb-1">
                    <span className="uppercase tracking-wider font-semibold text-slate-400">{product.category}</span>
                    {product.inStock && (
                        <span className="inline-flex items-center gap-1 text-emerald-600 text-[10px] font-semibold">
                            <span className="size-1.5 rounded-full bg-emerald-500"></span>
                            In Stock
                        </span>
                    )}
                </div>

                {/* Product Name */}
                <h3 className="font-semibold text-slate-800 text-sm leading-snug line-clamp-1 group-hover:text-orange-600 transition-colors">
                    {product.name}
                </h3>

                {/* Star Ratings */}
                <div className="flex items-center gap-1.5 mt-1.5">
                    <div className="flex items-center">
                        {Array(5).fill('').map((_, index) => (
                            <Star
                                key={index}
                                size={12}
                                className="text-transparent"
                                fill={avgRating >= index + 1 ? "#F59E0B" : "#E2E8F0"}
                            />
                        ))}
                    </div>
                    <span className="text-xs font-bold text-slate-700">{avgRating.toFixed(1)}</span>
                    <span className="text-[11px] text-slate-400">({ratingCount})</span>
                </div>

                {/* Price & Action Row */}
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
                    <div>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-base sm:text-lg font-bold text-slate-900">
                                {currency}{product.price}
                            </span>
                            {product.mrp > product.price && (
                                <span className="text-xs text-slate-400 line-through">
                                    {currency}{product.mrp}
                                </span>
                            )}
                        </div>
                        {discountPercent > 0 && (
                            <span className="text-[10px] font-semibold text-emerald-600">
                                Save {currency}{product.mrp - product.price}
                            </span>
                        )}
                    </div>

                    {/* Quick Add to Cart Button */}
                    <button
                        onClick={handleAddToCart}
                        type="button"
                        className={`size-9 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-90 shadow-sm cursor-pointer ${
                            isAdded
                                ? "bg-emerald-600 text-white shadow-emerald-500/30 scale-105"
                                : "bg-slate-900 hover:bg-orange-600 text-white hover:shadow-md hover:shadow-orange-500/25"
                        }`}
                        title="Add to Cart"
                    >
                        {isAdded ? <Check size={16} strokeWidth={2.5} /> : <ShoppingBag size={15} />}
                    </button>
                </div>
            </div>
        </Link>
    )
}

export default ProductCard