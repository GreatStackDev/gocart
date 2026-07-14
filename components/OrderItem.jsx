'use client'
import Image from "next/image";
import { DotIcon, MessageSquareIcon, CheckCircleIcon } from "lucide-react";
import { useSelector } from "react-redux";
import Rating from "./Rating";
import { useState } from "react";
import RatingModal from "./RatingModal";
import ChatWidget from "./ChatWidget";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";

const OrderItem = ({ order }) => {
    const { getToken } = useAuth();
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';
    const [ratingModal, setRatingModal] = useState(null);
    const [showChat, setShowChat] = useState(false);
    const [confirming, setConfirming] = useState(false);

    const { ratings } = useSelector(state => state.rating);

    const handleConfirmDelivery = async () => {
        if (!window.confirm("Are you sure you want to confirm delivery? This will release payment to the seller.")) return;
        
        setConfirming(true);
        try {
            const token = await getToken();
            await axios.post("/api/orders/confirm-delivery", { orderId: order.id }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Delivery confirmed! Thank you.");
            // Ideally refresh orders list here. For now, rely on page reload.
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || "Failed to confirm delivery");
        } finally {
            setConfirming(false);
        }
    };

    return (
        <>
            <tr className="text-sm">
                <td className="text-left">
                    <div className="flex flex-col gap-6">
                        {order.orderItems.map((item, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className="w-20 aspect-square bg-slate-100 flex items-center justify-center rounded-md">
                                    <Image
                                        className="h-14 w-auto"
                                        src={item.product.images[0]}
                                        alt="product_img"
                                        width={50}
                                        height={50}
                                    />
                                </div>
                                <div className="flex flex-col justify-center text-sm">
                                    <p className="font-medium text-slate-600 text-base">{item.product.name}</p>
                                    <p>{currency}{item.price} Qty : {item.quantity} </p>
                                    <p className="mb-1 text-xs text-gray-400">{new Date(order.createdAt).toDateString()}</p>
                                    <div>
                                        {ratings.find(rating => order.id === rating.orderId && item.product.id === rating.productId)
                                            ? <Rating value={ratings.find(rating => order.id === rating.orderId && item.product.id === rating.productId).rating} />
                                            : <button onClick={() => setRatingModal({ orderId: order.id, productId: item.product.id })} className={`text-green-500 hover:bg-green-50 transition text-xs font-medium px-2 py-1 rounded-md border border-green-200 ${order.status !== "DELIVERED" && 'hidden'}`}>Rate Product</button>
                                        }
                                    </div>
                                    {ratingModal && <RatingModal ratingModal={ratingModal} setRatingModal={setRatingModal} />}
                                </div>
                            </div>
                        ))}
                    </div>
                </td>

                <td className="text-center max-md:hidden font-semibold">{currency}{order.total}</td>

                <td className="text-left max-md:hidden text-xs text-gray-500">
                    <p className="font-medium text-gray-700">{order.address.name}</p>
                    <p>{order.address.street}</p>
                    <p>{order.address.city}, {order.address.state}, {order.address.zip}, {order.address.country}</p>
                    <p>{order.address.phone}</p>
                </td>

                <td className="text-left space-y-3 text-sm max-md:hidden">
                    <div
                        className={`flex items-center justify-center gap-1 rounded-full p-1 text-xs font-medium ${
                            order.status === 'DELIVERED'
                                ? 'text-green-700 bg-green-100'
                                : order.status === 'SHIPPED'
                                ? 'text-blue-700 bg-blue-100'
                                : 'text-amber-700 bg-amber-100'
                            }`}
                    >
                        <DotIcon size={12} className="scale-150" />
                        {order.status.split('_').join(' ')}
                    </div>

                    <div className="flex flex-col gap-2">
                        <button 
                            onClick={() => setShowChat(true)}
                            className="flex items-center justify-center gap-1.5 w-full py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-xs transition-colors border border-gray-200 font-medium"
                        >
                            <MessageSquareIcon className="w-3.5 h-3.5" /> Message Seller
                        </button>
                        
                        {order.status === 'DELIVERED' && order.escrowStatus === 'held' && (
                            <button 
                                onClick={handleConfirmDelivery}
                                disabled={confirming}
                                className="flex items-center justify-center gap-1.5 w-full py-1.5 bg-[#F59E0B] hover:bg-[#d98b09] text-white rounded-lg text-xs transition-colors font-medium disabled:opacity-50"
                            >
                                <CheckCircleIcon className="w-3.5 h-3.5" /> Confirm Delivery
                            </button>
                        )}
                        
                        {order.escrowStatus === 'released' && (
                            <span className="text-center text-[10px] text-green-600 font-medium">Funds Released</span>
                        )}
                    </div>
                </td>
            </tr>
            {/* Mobile View */}
            <tr className="md:hidden">
                <td colSpan={5}>
                    <div className="bg-gray-50 p-4 rounded-lg mt-2 mb-4 space-y-3">
                        <div className="text-xs text-gray-500">
                            <p className="font-medium text-gray-700">{order.address.name}</p>
                            <p>{order.address.street}</p>
                            <p>{order.address.city}, {order.address.state}, {order.address.zip}, {order.address.country}</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className='px-3 py-1 rounded bg-green-100 text-green-700 text-xs font-medium' >
                                {order.status.replace(/_/g, ' ')}
                            </span>
                            <button onClick={() => setShowChat(true)} className="text-xs font-medium text-blue-600 underline">Chat</button>
                        </div>
                    </div>
                </td>
            </tr>
            <tr>
                <td colSpan={4}>
                    <div className="border-b border-gray-100 w-full" />
                </td>
            </tr>

            {/* Chat Modal */}
            {showChat && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-md h-[500px]">
                        <ChatWidget 
                            orderId={order.id} 
                            storeName={order.store?.name} 
                            onClose={() => setShowChat(false)} 
                        />
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}

export default OrderItem