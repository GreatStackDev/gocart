"use client";

import Loading from "@/components/Loading";
import OrdersAreaChart from "@/components/OrdersAreaChart";
import axios from "axios";
import {
  CircleDollarSignIcon,
  ShoppingBasketIcon,
  StoreIcon,
  TagsIcon,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const { getToken } = useAuth();

  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "R";

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    products: 0,
    revenue: 0,
    orders: 0,
    stores: 0,
    allOrders: [],
  });

  const dashboardCardsData = [
    {
      title: "Total Products",
      value: dashboardData.products,
      icon: ShoppingBasketIcon,
    },
    {
      title: "Total Revenue",
      value: currency + dashboardData.revenue,
      icon: CircleDollarSignIcon,
    },
    { title: "Total Orders", value: dashboardData.orders, icon: TagsIcon },
    { title: "Total Stores", value: dashboardData.stores, icon: StoreIcon },
  ];

  const fetchDashboardData = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDashboardData(data.dashboardData);
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.error || "Failed to load dashboard data",
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="pb-20">
        {/* Page header */}
        <div className="mb-8">
            <h1 className="font-[family-name:var(--font-heading)] font-bold text-2xl text-[#111827]">
                Dashboard
            </h1>
            <p className="text-sm text-[#6B7280] mt-1">
                Platform overview and performance metrics.
            </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {dashboardCardsData.map((card, index) => (
                <div
                    key={index}
                    className="bg-white border border-[#E5E7EB] rounded-[12px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] flex items-center justify-between gap-4"
                >
                    <div>
                        <p className="text-xs text-[#6B7280] font-medium uppercase tracking-wider">{card.title}</p>
                        <p className="font-[family-name:var(--font-heading)] font-bold text-2xl text-[#111827] mt-1">
                            {card.value}
                        </p>
                    </div>
                    <div className="w-10 h-10 flex items-center justify-center bg-[#EEF2FF] rounded-[10px] shrink-0">
                        <card.icon size={18} className="text-[#1E1B4B]" />
                    </div>
                </div>
            ))}
        </div>

        {/* Revenue chart */}
        <div>
            <h2 className="font-[family-name:var(--font-heading)] font-semibold text-lg text-[#111827] mb-4">
                Revenue over time
            </h2>
            <div className="bg-white border border-[#E5E7EB] rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-5">
                <OrdersAreaChart allOrders={dashboardData.allOrders} />
            </div>
        </div>
    </div>

  );
}
