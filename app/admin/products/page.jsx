'use client'

import { useEffect, useState } from "react"
import { useAuth, useUser } from "@clerk/nextjs"
import axios from "axios"
import toast from "react-hot-toast"
import Loading from "@/components/Loading"
import { Trash2Icon, PackageIcon } from "lucide-react"

export default function AdminProductsPage() {
    const { user } = useUser()
    const { getToken } = useAuth()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchProducts = async () => {
        try {
            const token = await getToken()
            const response = await axios.get("/api/admin/products", {
                headers: { Authorization: `Bearer ${token}` }
            })
            setProducts(response.data.products || [])
        } catch (error) {
            console.error("Failed to fetch products:", error)
            toast.error("Failed to load products")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (productId) => {
        if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
        
        try {
            const token = await getToken()
            await axios.delete(`/api/admin/products?productId=${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            toast.success("Product deleted successfully")
            fetchProducts()
        } catch (error) {
            console.error("Failed to delete product:", error)
            toast.error("Failed to delete product")
        }
    }

    useEffect(() => {
        if (user) fetchProducts()
    }, [user])

    return !loading ? (
        <div className="space-y-6 mb-28">
            <div>
                <h1 className="text-2xl font-[family-name:var(--font-heading)] font-bold text-[#1E1B4B]">
                    Product Moderation
                </h1>
                <p className="text-sm text-[#6B7280] mt-1">Review all products listed on the platform and remove violating items.</p>
            </div>

            {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-80 bg-white border border-gray-100 rounded-xl">
                    <PackageIcon className="w-12 h-12 text-[#9CA3AF] mb-4" />
                    <h2 className="text-[#1E1B4B] font-semibold text-lg">No Products Found</h2>
                    <p className="text-[#6B7280] mt-1 text-sm">There are currently no products listed on the platform.</p>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 uppercase text-xs font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4">Store</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <img src={product.images[0]} alt={product.name} className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                                                <div>
                                                    <p className="font-medium text-[#1E1B4B] line-clamp-1">{product.name}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5 capitalize">{product.category}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium">{product.store?.name || 'Unknown Store'}</td>
                                        <td className="px-6 py-4 font-semibold text-[#F59E0B]">R {product.price}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => handleDelete(product.id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-flex"
                                                title="Delete Product"
                                            >
                                                <Trash2Icon className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    ) : <Loading />
}
