'use client'
import ProductDescription from "@/src/components/ProductDescription";
import ProductDetails from "@/src/components/ProductDetails";
import type { Product as ProductItem } from "@/src/lib/features/product/productSlice";
import { useAppSelector } from "@/src/lib/hooks";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Product() {

    const { productId } = useParams();
    const [product, setProduct] = useState<ProductItem>();
    const products = useAppSelector(state => state.product.list);

    const fetchProduct = async () => {
        const product = products.find((product) => product.id === productId);
        setProduct(product);
    }

    useEffect(() => {
        if (products.length > 0) {
            fetchProduct()
        }
        scrollTo(0, 0)
    }, [productId,products]);

    return (
        <div className="mx-6">
            <div className="max-w-7xl mx-auto">

                {/* Breadcrums */}
                <div className="  text-gray-600 text-sm mt-8 mb-5">
                    Home / Products / {product?.category}
                </div>

                {/* Product Details */}
                {product && (<ProductDetails product={product} />)}

                {/* Description & Reviews */}
                {product && (<ProductDescription product={product} />)}
            </div>
        </div>
    );
}
