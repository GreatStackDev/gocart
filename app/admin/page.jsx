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
    <div className="text-[#6B7280]">
      <h1 className="font-[family-name:var(--font-heading)] font-bold text-2xl text-[#111827] mb-1">
        Admin <span className="text-[#1E1B4B]">Dashboard</span>
      </h1>
      <p className="text-sm text-[#9CA3AF] mb-6">Platform overview and performance metrics</p>

      {/* KPI Cards */}
      <div className="flex flex-wrap gap-4 mb-8">
        {dashboardCardsData.map((card, index) => (
          <div
            key={index}
            className="flex items-center gap-5 bg-white border border-[#E5E7EB] rounded-[12px] p-4 px-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] min-w-[180px]"
          >
            <div className="flex flex-col gap-1">
              <p className="text-xs text-[#9CA3AF] font-medium">{card.title}</p>
              <p className="font-[family-name:var(--font-heading)] font-bold text-2xl text-[#1E1B4B]">
                {card.value}
              </p>
            </div>
            <div className="ml-auto w-10 h-10 flex items-center justify-center bg-[#EEF2FF] rounded-[10px]">
              <card.icon size={20} className="text-[#1E1B4B]" />
            </div>
          </div>
        ))}
      </div>

      {/* Area Chart */}
      <OrdersAreaChart allOrders={dashboardData.allOrders} />
    </div>
  );
}
