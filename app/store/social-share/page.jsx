'use client'

import { useEffect, useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { useUser, useAuth } from "@clerk/nextjs"
import Loading from "@/components/Loading"
import { LinkIcon, Share2Icon, Copy, Globe } from "lucide-react"

export default function SocialSharePage() {
    const { user } = useUser()
    const { getToken } = useAuth()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchProducts = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get("/api/store/product", {
                headers: { Authorization: `Bearer ${token}` }
            })
            setProducts(data.products || [])
        } catch (error) {
            console.error("Failed to fetch products:", error)
            toast.error("Failed to load products for social share")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user) fetchProducts()
    }, [user])

    const generateUrl = (productId) => {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://tradrsavenue.co.za"
        return `${baseUrl}/product/${productId}`
    }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
        toast.success("Link copied to clipboard!")
    }

    const shareToWhatsApp = (product) => {
        const url = generateUrl(product.id)
        const text = `Check out this amazing product: ${product.name} on tradrsAvenue!\n\n${url}`
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
    }

    const shareToFacebook = (product) => {
        const url = generateUrl(product.id)
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
    }

    return !loading ? (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-[family-name:var(--font-heading)] font-bold text-[#1E1B4B]">
                    Social Share
                </h1>
                <p className="text-sm text-[#6B7280] mt-1">Generate preview links for your products to share on social media.</p>
            </div>

            {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 bg-white border border-gray-100 rounded-xl">
                    <Share2Icon className="w-12 h-12 text-[#9CA3AF] mb-4" />
                    <h2 className="text-[#1E1B4B] font-semibold text-lg">No Products Found</h2>
                    <p className="text-[#6B7280] mt-1 text-sm">Add some products first to start sharing them.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => (
                        <div key={product.id} className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm flex flex-col justify-between">
                            <div className="flex items-start gap-4 mb-4">
                                <img src={product.images[0]} alt={product.name} className="w-16 h-16 rounded-md object-cover border border-gray-100" />
                                <div>
                                    <h3 className="font-semibold text-[#1E1B4B] line-clamp-1">{product.name}</h3>
                                    <p className="text-sm text-[#F59E0B] font-medium">R {product.price}</p>
                                </div>
                            </div>
                            
                            {/* Actions */}
                            <div className="flex flex-col gap-2 mt-2">
                                <button 
                                    onClick={() => copyToClipboard(generateUrl(product.id))}
                                    className="flex items-center justify-center gap-2 w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm transition-colors border border-gray-200"
                                >
                                    <LinkIcon className="w-4 h-4" /> Copy Link
                                </button>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => shareToWhatsApp(product)}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg text-sm transition-colors"
                                    >
                                        <Share2Icon className="w-4 h-4" /> WhatsApp
                                    </button>
                                    <button 
                                        onClick={() => shareToFacebook(product)}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-lg text-sm transition-colors"
                                    >
                                        <Globe className="w-4 h-4" /> Facebook
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    ) : <Loading />
}
