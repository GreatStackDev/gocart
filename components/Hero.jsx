'use client'
import { assets } from '@/assets/assets'
import { ArrowRightIcon, ChevronRightIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import CategoriesMarquee from './CategoriesMarquee'
import { Button } from './ui/Button'

const Hero = () => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    return (
        <div className='mx-6'>
            <div className='flex max-xl:flex-col gap-8 max-w-7xl mx-auto my-10'>
                <div className='relative flex-1 flex flex-col bg-gradient-to-br from-green-100 via-green-200 to-green-300 rounded-3xl xl:min-h-100 group overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 animate-fade-in-up'>
                    <div className='p-5 sm:p-16 relative z-10'>
                        <div className='inline-flex items-center gap-3 bg-green-300/90 backdrop-blur-sm text-green-800 pr-4 p-1 rounded-full text-xs sm:text-sm hover:bg-green-400/90 transition-all duration-300'>
                            <span className='bg-green-600 px-3 py-1 max-sm:ml-1 rounded-full text-white text-xs shadow-lg animate-pulse'>NEWS</span> 
                            Free Shipping on Orders Above $50! 
                            <ChevronRightIcon className='group-hover:ml-2 transition-all duration-200 group-hover:text-green-900' size={16} />
                        </div>
                        <h2 className='text-3xl sm:text-5xl leading-[1.2] my-3 font-bold bg-gradient-to-r from-slate-700 via-slate-800 to-[#A0FF74] bg-clip-text text-transparent max-w-xs sm:max-w-md drop-shadow-sm'>
                            Gadgets you'll love. Prices you'll trust.
                        </h2>
                        <div className='text-slate-800 text-sm font-medium mt-4 sm:mt-8'>
                            <p className="text-slate-600">Starts from</p>
                            <p className='text-4xl font-bold text-slate-800 drop-shadow-sm'>{currency}4.90</p>
                        </div>
                        <Button size="lg" className="mt-4 sm:mt-10 shadow-xl hover:shadow-2xl transform hover:scale-105 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black">
                            LEARN MORE
                        </Button>
                    </div>
                    <Image className='sm:absolute bottom-0 right-0 md:right-10 w-full sm:max-w-sm transition-transform duration-500 group-hover:scale-105 drop-shadow-lg' src={assets.hero_model_img} alt="Featured product" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className='flex flex-col md:flex-row xl:flex-col gap-5 w-full xl:max-w-sm text-sm text-slate-600'>
                    <div className='flex-1 flex items-center justify-between w-full bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300 rounded-3xl p-6 px-8 group shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-slide-in-right'>
                        <div>
                            <p className='text-3xl font-bold bg-gradient-to-r from-slate-800 via-orange-600 to-[#FFAD51] bg-clip-text text-transparent max-w-40 drop-shadow-sm'>Best products</p>
                            <p className='flex items-center gap-1 mt-4 text-slate-700 transition-colors duration-200 group-hover:text-orange-700 font-medium'>View more <ArrowRightIcon className='group-hover:ml-2 transition-all duration-200' size={18} /> </p>
                        </div>
                        <div className="relative">
                            <Image className='w-35 transition-transform duration-500 group-hover:scale-110 drop-shadow-lg' src={assets.hero_product_img1} alt="Best products" />
                            <div className="absolute inset-0 bg-gradient-to-t from-orange-200/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                        </div>
                    </div>
                    <div className='flex-1 flex items-center justify-between w-full bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 rounded-3xl p-6 px-8 group shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-slide-in-right' style={{animationDelay: '0.2s'}}>
                        <div>
                            <p className='text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-[#78B2FF] bg-clip-text text-transparent max-w-40 drop-shadow-sm'>20% discounts</p>
                            <p className='flex items-center gap-1 mt-4 text-slate-700 transition-colors duration-200 group-hover:text-blue-700 font-medium'>View more <ArrowRightIcon className='group-hover:ml-2 transition-all duration-200' size={18} /> </p>
                        </div>
                        <div className="relative">
                            <Image className='w-35 transition-transform duration-500 group-hover:scale-110 drop-shadow-lg' src={assets.hero_product_img2} alt="Discounted products" />
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-200/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                        </div>
                    </div>
                </div>
            </div>
            <CategoriesMarquee />
        </div>

    )
}

export default Hero