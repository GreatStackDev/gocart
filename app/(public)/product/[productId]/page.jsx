import ProductDescription from "@/components/ProductDescription";
import ProductDetails from "@/components/ProductDetails";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

// Generate Open Graph Metadata
export async function generateMetadata({ params }) {
    const { productId } = await params;

    const product = await prisma.product.findUnique({
        where: { id: productId },
        include: { store: true },
    });

    if (!product) {
        return { title: "Product Not Found" };
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://tradrsavenue.co.za";

    return {
        title: `${product.name} | tradrsAvenue`,
        description: product.description ? product.description.substring(0, 160) : product.name,
        openGraph: {
            title: product.name,
            description: product.description ? product.description.substring(0, 160) : product.name,
            url: `${baseUrl}/product/${productId}`,
            siteName: "tradrsAvenue",
            images: [
                {
                    url: `${baseUrl}/api/og?productId=${productId}`,
                    width: 1200,
                    height: 630,
                    alt: product.name,
                }
            ],
            locale: "en_ZA",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: product.name,
            description: product.description ? product.description.substring(0, 160) : product.name,
            images: [`${baseUrl}/api/og?productId=${productId}`],
        },
    };
}

export default async function Product({ params }) {
    const { productId } = await params;

    // Fetch product directly on the server for SEO and fast loading
    const product = await prisma.product.findUnique({
        where: { id: productId },
        include: { store: true },
    });

    if (!product) {
        return notFound();
    }

    return (
        <div className="mx-6">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumbs */}
                <div className="text-gray-600 text-sm mt-8 mb-5">
                    Home / Products / {product.category}
                </div>

                {/* Product Details */}
                <ProductDetails product={product} />

                {/* Description & Reviews */}
                <ProductDescription product={product} />
            </div>
        </div>
    );
}