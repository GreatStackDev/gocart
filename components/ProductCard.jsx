'use client'
import { StarIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import VerifiedBadge from './VerifiedBadge'
import { SkeletonCard } from './ui/Skeleton'

const ProductCard = ({ product, loading = false }) => {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'R'

    if (loading) return <SkeletonCard />

    // Average rating — guard against empty array
    const avgRating = product.rating?.length
        ? Math.round(product.rating.reduce((acc, curr) => acc + curr.rating, 0) / product.rating.length)
        : 0

    const isOutOfStock = !product.inStock

    return (
        <Link
            href={`/product/${product.id}`}
            className="group block"
        >
            <div
                className="bg-white rounded-[12px] border border-[#E5E7EB] overflow-hidden
                           shadow-[0_1px_3px_rgba(0,0,0,0.08)]
                           transition-all duration-150
                           hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)]"
            >
                {/* Image container */}
                <div className="relative bg-[#F9FAFB] h-44 sm:h-52 flex items-center justify-center overflow-hidden">
                    <Image
                        width={300}
                        height={300}
                        className="max-h-36 sm:max-h-44 w-auto object-contain"
                        src={product.images?.[0] ?? '/placeholder.png'}
                        alt={product.name}
                    />

                    {/* Out of stock overlay */}
                    {isOutOfStock && (
                        <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                            <span className="text-xs font-semibold text-[#EF4444] bg-white border border-[#EF4444] px-2.5 py-1 rounded-full">
                                Out of Stock
                            </span>
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="p-3">
                    {/* Store name + verified badge */}
                    {product.store && (
                        <div className="flex items-center gap-1.5 mb-1.5">
                            <span className="text-[11px] text-[#9CA3AF] truncate">{product.store.name}</span>
                            <VerifiedBadge status={product.store?.verificationStatus} />
                        </div>
                    )}

                    {/* Product name */}
                    <p className="text-sm font-medium text-[#111827] line-clamp-2 leading-snug">
                        {product.name}
                    </p>

                    {/* Star rating */}
                    {product.rating?.length > 0 && (
                        <div className="flex items-center gap-0.5 mt-1.5">
                            {Array(5).fill('').map((_, i) => (
                                <StarIcon
                                    key={i}
                                    size={12}
                                    className="text-transparent"
                                    fill={avgRating >= i + 1 ? '#F59E0B' : '#E5E7EB'}
                                />
                            ))}
                            <span className="text-[10px] text-[#9CA3AF] ml-1">({product.rating.length})</span>
                        </div>
                    )}

                    {/* Price row */}
                    <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-[#F3F4F6]">
                        <div>
                            <span className="font-[family-name:var(--font-heading)] font-bold text-[#1E1B4B] text-base">
                                {currency}{product.price}
                            </span>
                            {product.mrp > product.price && (
                                <span className="text-[11px] text-[#9CA3AF] line-through ml-1.5">
                                    {currency}{product.mrp}
                                </span>
                            )}
                        </div>

                        {/* Free shipping badge */}
                        {product.store?.freeShipping && (
                            <span className="text-[10px] font-medium text-[#92400E] bg-[#FEF3C7] px-2 py-0.5 rounded-full">
                                Free Ship
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default ProductCard