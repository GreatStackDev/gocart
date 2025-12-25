'use client'

const ProductCardSkeleton = () => {
    return (
        <div className='max-xl:mx-auto block rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden animate-pulse'>
            {/* Image Skeleton */}
            <div className='bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 h-40 sm:w-60 sm:h-68 rounded-2xl flex items-center justify-center relative'>
                <div className="w-20 h-20 bg-slate-300 rounded-lg animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer"></div>
            </div>
            
            {/* Content Skeleton */}
            <div className='pt-4 pb-5 px-4 space-y-3'>
                <div className='flex justify-between gap-3'>
                    <div className='flex-1 space-y-2'>
                        {/* Product name skeleton */}
                        <div className='h-4 bg-slate-200 rounded animate-pulse'></div>
                        
                        {/* Rating skeleton */}
                        <div className='flex items-center gap-1'>
                            {Array(5).fill('').map((_, index) => (
                                <div key={index} className="w-3 h-3 bg-slate-200 rounded animate-pulse"></div>
                            ))}
                            <div className='h-3 w-8 bg-slate-200 rounded ml-1 animate-pulse'></div>
                        </div>
                    </div>
                    
                    {/* Price skeleton */}
                    <div className="flex flex-col items-end space-y-1">
                        <div className='h-5 w-16 bg-slate-200 rounded animate-pulse'></div>
                        <div className='h-3 w-12 bg-slate-100 rounded animate-pulse'></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Multiple skeleton cards component
export const ProductCardSkeletons = ({ count = 4 }) => {
    return (
        <div className='grid grid-cols-2 sm:flex flex-wrap gap-6 justify-between'>
            {Array(count).fill('').map((_, index) => (
                <ProductCardSkeleton key={index} />
            ))}
        </div>
    )
}

export default ProductCardSkeleton