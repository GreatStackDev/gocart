'use client'
import Link from 'next/link'
import { ArrowRightIcon, TrendingUpIcon, StoreIcon } from 'lucide-react'
import CategoriesMarquee from './CategoriesMarquee'
import Image from 'next/image'
import { assets, hero_dynamic_images } from '@/assets/assets'
import { useState, useEffect } from 'react'

/**
 * tradrsAvenue — Hero Section
 * Preserves the 3-banner layout from the original codebase.
 * Flat colors only — zero gradients.
 * Hover: subtle lift (translateY(-2px) + shadow step up).
 */
const Hero = () => {
    const [img1, setImg1] = useState(assets.hero_product_img1)
    const [img2, setImg2] = useState(assets.hero_product_img2)

    useEffect(() => {
        if (hero_dynamic_images && hero_dynamic_images.length >= 2) {
            const shuffled = [...hero_dynamic_images].sort(() => 0.5 - Math.random())
            setImg1(shuffled[0])
            setImg2(shuffled[1])
        }
    }, [])

    return (
        <section className="px-6 pt-8 pb-4">
            <div className="max-w-7xl mx-auto">

                {/* 3-Banner Grid — layout preserved, colors updated */}
                <div className="flex max-xl:flex-col gap-5">

                    {/* ── Main Hero Banner (large left) ── */}
                    <div
                        className="relative flex-1 flex flex-col bg-[#1E1B4B] rounded-[16px] xl:min-h-[420px] overflow-hidden
                                   transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
                    >
                        <div className="p-8 sm:p-12 flex flex-col justify-between h-full">
                            {/* Top badge — static pill */}
                            <div className="inline-flex items-center self-start gap-2 bg-[#F59E0B] text-white px-3 py-1 rounded-full text-xs font-medium mb-6">
                                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                                South Africa&apos;s Local Marketplace
                            </div>

                            {/* Headline */}
                            <div>
                                <h1 className="text-3xl sm:text-5xl font-[family-name:var(--font-heading)] font-bold text-white leading-[1.15] max-w-md">
                                    Buy local.<br />
                                    Sell boldly.
                                </h1>
                                <p className="text-[#A5B4FC] mt-3 text-sm sm:text-base max-w-xs">
                                    Thousands of products from verified SA vendors — delivered to your door.
                                </p>
                            </div>

                            {/* CTA */}
                            <div className="flex items-center gap-3 mt-8">
                                <Link
                                    href="/shop"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#F59E0B] text-white text-sm font-medium rounded-[8px] hover:bg-[#D97706] transition-all duration-150 hover:-translate-y-0.5"
                                >
                                    Shop Now
                                    <ArrowRightIcon size={15} />
                                </Link>
                                <Link
                                    href="/create-store"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white text-sm font-medium rounded-[8px] hover:bg-white/20 transition-all duration-150 border border-white/20"
                                >
                                    Start Selling
                                </Link>
                            </div>
                        </div>

                        {/* Image */}
                        <Image className="sm:absolute bottom-0 right-0 md:right-10 w-full sm:max-w-sm pointer-events-none" src={assets.hero_model_img} alt="" />
                        
                        {/* Decorative — flat, no gradient */}
                        <div className="absolute bottom-0 right-0 w-52 h-52 rounded-full bg-white/5 -mr-16 -mb-16 pointer-events-none" />
                        <div className="absolute top-0 right-16 w-32 h-32 rounded-full bg-[#F59E0B]/10 -mt-10 pointer-events-none" />
                    </div>

                    {/* ── Side banners column ── */}
                    <div className="flex flex-col md:flex-row xl:flex-col gap-5 w-full xl:max-w-[320px]">

                        {/* Side Banner 1 — Trending */}
                        <Link
                            href="/shop?sort=trending"
                            className="flex-1 flex items-center justify-between bg-[#FEF3C7] rounded-[16px] p-6 group
                                       transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)]"
                        >
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUpIcon size={16} className="text-[#92400E]" />
                                    <span className="text-xs font-semibold text-[#92400E] uppercase tracking-wider">Trending</span>
                                </div>
                                <p className="font-[family-name:var(--font-heading)] font-bold text-2xl text-[#111827] max-w-[140px] leading-tight">
                                    This Week&apos;s Top Picks
                                </p>
                                <p className="flex items-center gap-1 mt-3 text-sm text-[#6B7280]">
                                    View all
                                    <ArrowRightIcon size={14} className="transition-transform duration-150 group-hover:translate-x-1" />
                                </p>
                            </div>
                            {/* Product Image */}
                            <Image className="w-35" src={img1} alt="" />
                        </Link>

                        {/* Side Banner 2 — Become a Seller */}
                        <Link
                            href="/create-store"
                            className="flex-1 flex items-center justify-between bg-[#EEF2FF] rounded-[16px] p-6 group
                                       transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)]"
                        >
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <StoreIcon size={16} className="text-[#3730A3]" />
                                    <span className="text-xs font-semibold text-[#3730A3] uppercase tracking-wider">Sellers</span>
                                </div>
                                <p className="font-[family-name:var(--font-heading)] font-bold text-2xl text-[#111827] max-w-[140px] leading-tight">
                                    Open Your Store Free
                                </p>
                                <p className="flex items-center gap-1 mt-3 text-sm text-[#6B7280]">
                                    Get started
                                    <ArrowRightIcon size={14} className="transition-transform duration-150 group-hover:translate-x-1" />
                                </p>
                            </div>
                            {/* Product Image */}
                            <Image className="w-35" src={img2} alt="" />
                        </Link>

                    </div>
                </div>
            </div>

            {/* Category pill marquee */}
            <CategoriesMarquee />
        </section>
    )
}

export default Hero