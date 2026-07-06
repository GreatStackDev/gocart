'use client'
import PageTitle from "@/components/PageTitle"
import { useEffect, useState } from "react";
import OrderItem from "@/components/OrderItem";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";

export default function Orders() {

    const { getToken } = useAuth();
    const { user, isLoaded} = useUser();
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = await getToken();
                const { data } = await axios.get("/api/orders", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setOrders(data);
                setLoading(false);
            } catch (error) {
                toast.error(error?.response?.data?.error || error.message);
            }
        };

        if (isLoaded) {
            if (!user) {
                toast.error("You are not logged in");
                router.push("/auth");
            } else {
                fetchOrders();
            }
        }
    }, [isLoaded, user, getToken, router]);

    if(!isLoaded || loading) {
        return <Loading />
    }

    return (
        <div className="min-h-[70vh] mx-6">
            {orders.length > 0 ? (
                (
                    <div className="my-20 max-w-7xl mx-auto">
                        <PageTitle heading="My Orders" text={`Showing total ${orders.length} orders`} linkText={'Go to home'} />

                        <table className="w-full max-w-5xl text-slate-500 table-auto border-separate border-spacing-y-12 border-spacing-x-4">
                            <thead>
                                <tr className="max-sm:text-sm text-slate-600 max-md:hidden">
                                    <th className="text-left">Product</th>
                                    <th className="text-center">Total Price</th>
                                    <th className="text-left">Address</th>
                                    <th className="text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <OrderItem order={order} key={order.id} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            ) : (
                <div className="min-h-[80vh] mx-6 flex items-center justify-center text-slate-400">
                    <h1 className="text-2xl sm:text-4xl font-semibold">You have no orders</h1>
                </div>
            )}
        </div>
    )
}