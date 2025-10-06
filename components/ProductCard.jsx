'use client'
import { StarIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const ProductCard = ({ product }) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    // calculate the average rating of the product
    const rating = Math.round(product.rating.reduce((acc, curr) => acc + curr.rating, 0) / product.rating.length);

    return (
        <Link href={`/product/${product.id}`} className='group max-xl:mx-auto block rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-slate-200 transform hover:-translate-y-1'>
            <div className='bg-gradient-to-br from-slate-50 to-slate-100 h-40 sm:w-60 sm:h-68 rounded-2xl flex items-center justify-center overflow-hidden relative'>
                <Image width={500} height={500} className='max-h-30 sm:max-h-40 w-auto group-hover:scale-110 transition-transform duration-500 ease-out' src={product.images[0]} alt={product.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className='flex justify-between gap-3 text-sm text-slate-800 pt-4 pb-5 px-4'>
                <div className='flex-1 min-w-0'>
                    <p className='font-semibold truncate group-hover:text-green-600 transition-colors duration-200'>{product.name}</p>
                    <div className='flex items-center mt-2 gap-1'>
                        {Array(5).fill('').map((_, index) => (
                            <StarIcon key={index} size={14} className='text-transparent transition-all duration-200' fill={rating >= index + 1 ? "#10b981" : "#E5E7EB"} />
                        ))}
                        <span className='text-xs text-slate-500 ml-1'>({product.rating.length})</span>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <p className='font-bold text-lg text-green-600 whitespace-nowrap'>{currency}{product.price}</p>
                    <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">View Details</span>
                </div>
            </div>
        </Link>
    )
}

export default ProductCard