'use client'
import React from 'react'
import Title from './Title'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'

const RecommendedProducts = () => {
    const displayQuantity = 4;
    const products = useSelector(state => state.product.list);

    // Very simple placeholder logic for now:
    // Just pick 4 random products until backend exists.
    const recommendations = [...products]
        .sort(() => Math.random() - 0.5)
        .slice(0, displayQuantity);

    return (
        <div className='px-6 my-30 max-w-6xl mx-auto'>
            <Title
                title='Recommended For You'
                description={`Showing ${recommendations.length} recommendations`}
                href='/shop'
            />
            
            <div className='mt-12 grid grid-cols-2 sm:flex flex-wrap gap-6 justify-between'>
                {recommendations.map((product, index) => (
                    <ProductCard key={index} product={product} />
                ))}
            </div>
        </div>
    );
};

export default RecommendedProducts;

