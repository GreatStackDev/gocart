// src/components/EditProductModal.jsx (Grey Focus Border Fix)

'use client';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function EditProductModal({ product, currency, onClose, onSave }) {
    
    const [formData, setFormData] = useState({
        mrp: product.mrp,
        price: product.price,
        quantity: product.quantity,
    });

    useEffect(() => {
        setFormData({
            mrp: product.mrp,
            price: product.price,
            quantity: product.quantity,
        });
    }, [product]); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: +value 
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (formData.price > formData.mrp) {
            alert("Discounted Price cannot be higher than the MRP/Original Price.");
            return;
        }
        
        onSave({ id: product.id, ...formData });
    };

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm" onClick={onClose}>
            
            <div 
                className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md mx-4 transform transition-all duration-300 scale-100 opacity-100" 
                onClick={(e) => e.stopPropagation()} 
            >
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-xl font-semibold text-slate-800">Edit Product: {product.name}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-gray-100 transition">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* MRP/Original Price Input */}
                    <div>
                        <label htmlFor="mrp" className="block text-sm font-medium text-slate-700">MRP / Original Price ({currency})</label>
                        <input
                            type="number"
                            id="mrp"
                            name="mrp"
                            value={formData.mrp}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            // 🌟 FOCUS FIX: Changed to focus:border-slate-400 focus:ring-slate-400
                            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-slate-400 focus:ring-1 focus:ring-slate-400 p-2"
                            required
                        />
                    </div>

                    {/* Price After Discount Input */}
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-slate-700">Discounted Price ({currency})</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            // 🌟 FOCUS FIX: Changed to focus:border-slate-400 focus:ring-slate-400
                            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-slate-400 focus:ring-1 focus:ring-slate-400 p-2"
                            required
                        />
                    </div>
                    
                    {/* Quantity Input */}
                    <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-slate-700">Quantity in Stock</label>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            min="0"
                            step="1"
                            // 🌟 FOCUS FIX: Changed to focus:border-slate-400 focus:ring-slate-400
                            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-slate-400 focus:ring-1 focus:ring-slate-400 p-2"
                            required
                        />
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="px-4 py-2 text-sm font-medium text-slate-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}