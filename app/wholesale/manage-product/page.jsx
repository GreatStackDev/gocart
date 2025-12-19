// WStoreManageProducts.jsx (Complete & Functional Code)

'use client'
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import Image from "next/image"
import Loading from "@/components/Loading"
import { productDummyData } from "@/assets/assets"
import { PencilIcon } from 'lucide-react'
import EditProductModal from '@/components/EditProductModal'; 

const FALLBACK_IMAGE = '/images/placeholder-product.png'; 

export default function WStoreManageProducts() {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState([])
    
    // State for Modal Management
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null); 

    const fetchProducts = async () => {
        // Simulating data fetch from a static source
        setProducts(productDummyData)
        setLoading(false)
    }

    const toggleStock = async (productId) => {
        // Logic to toggle the stock of a wholesale product
    }

    // Handler to open the modal with the product data
    const handleEditClick = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    // Handler to close the modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    // 🌟 FIX: Logic to update the 'products' state when the modal saves
    const handleSave = (updatedData) => {
        
        setProducts(currentProducts => {
            return currentProducts.map(p => {
                // Find the edited product by ID and merge the new data
                if (p.id === updatedData.id) {
                    return { ...p, ...updatedData };
                }
                return p;
            });
        });

        toast.success(`${updatedData.name} updated successfully.`);
        handleCloseModal();
    };

    useEffect(() => {
        fetchProducts()
    }, [])

    if (loading) return <Loading />

    return (
        <>
            <h1 className="text-2xl text-slate-500 mb-5">Manage <span className="text-slate-800 font-medium">Wholesale Products</span></h1>
            <table className="w-full max-w-4xl text-left ring ring-slate-200 rounded overflow-hidden text-sm">
                
                <thead className="bg-slate-50 text-gray-700 uppercase tracking-wider">
                    <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3 hidden md:table-cell">Description</th>
                        <th className="px-4 py-3 hidden md:table-cell">MRP</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3 text-center">Quantity</th>
                        <th className="px-4 py-3">Actions</th>
                    </tr>
                </thead>
                
                <tbody className="text-slate-700">
                    {products.map((product) => (
                        <tr key={product.id} className="border-t border-gray-200 hover:bg-gray-50">
                            
                            <td className="px-4 py-3 whitespace-nowrap min-w-max align-middle">
                                <div className="flex gap-2 items-center">
                                    <Image 
                                        width={40} 
                                        height={40} 
                                        className='p-1 shadow rounded cursor-pointer' 
                                        src={(product.images && product.images[0]) ? product.images[0] : FALLBACK_IMAGE} 
                                        alt={product.name || "Product Image"} 
                                    />
                                    {product.name}
                                </div>
                            </td>
                            
                            <td className="px-4 py-3 max-w-md text-slate-600 hidden md:table-cell truncate align-middle">{product.description}</td>
                            <td className="px-4 py-3 hidden md:table-cell align-middle">{currency} {product.mrp.toLocaleString()}</td>
                            <td className="px-4 py-3 whitespace-nowrap align-middle">{currency} {product.price.toLocaleString()}</td>
                            <td className="px-4 py-3 text-center align-middle">{product.quantity}</td>
                            
                            <td className="px-4 py-3 align-middle"> 
                                <div className="flex items-center justify-center space-x-3">
                                    
                                    {/* Edit Button: Opens modal and passes product data */}
                                    <button 
                                        onClick={() => handleEditClick(product)}
                                        className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100 transition duration-150"
                                        aria-label={`Edit ${product.name}`}
                                    >
                                        <PencilIcon size={16} />
                                    </button>
                                    
                                    {/* Toggle Button UI */}
                                    <label className="relative inline-flex items-center cursor-pointer text-gray-900">
                                        <input type="checkbox" className="sr-only peer" onChange={() => toast.promise(toggleStock(product.id), { loading: "Updating data..." })} checked={product.inStock} />
                                        <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
                                        <span className="dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                                    </label>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {/* Modal Component: Uses the dynamic key={id} to force remount and field update */}
            {isModalOpen && editingProduct && (
                <EditProductModal 
                    key={editingProduct.id} 
                    product={editingProduct} 
                    currency={currency}
                    onClose={handleCloseModal} 
                    onSave={handleSave}
                />
            )}
        </>
    )
}