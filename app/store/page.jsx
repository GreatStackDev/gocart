"use client";
import axios from "axios";
import Loading from "@/components/Loading";
import Button from "@/components/ui/Button";
import { useAuth } from "@clerk/nextjs";
import {
    CircleDollarSignIcon,
    ShoppingBasketIcon,
    StarIcon,
    TagsIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Dashboard() {
    const { getToken } = useAuth();
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "R";
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        totalProducts: 0,
        totalEarnings: 0,
        totalOrders: 0,
        ratings: [],
    });

    const dashboardCardsData = [
        {
            title: "Products",
            value: dashboardData.totalProducts,
            icon: ShoppingBasketIcon,
            accent: "#EEF2FF",
            iconColor: "#1E1B4B",
        },
        {
            title: "Total Earnings",
            value: `${currency}${dashboardData.totalEarnings}`,
            icon: CircleDollarSignIcon,
            accent: "#FEF3C7",
            iconColor: "#92400E",
        },
        {
            title: "Orders",
            value: dashboardData.totalOrders,
            icon: TagsIcon,
            accent: "#EEF2FF",
            iconColor: "#1E1B4B",
        },
        {
            title: "Reviews",
            value: dashboardData.ratings.length,
            icon: StarIcon,
            accent: "#FEF3C7",
            iconColor: "#92400E",
        },
    ];

    const fetchDashboardData = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get("/api/store/dashboard", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDashboardData(data.dashboardData);
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
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
                    Overview of your store performance.
                </p>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {dashboardCardsData.map((card, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-[12px] border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-5 flex items-center justify-between gap-4"
                    >
                        <div>
                            <p className="text-xs text-[#6B7280] font-medium uppercase tracking-wider">
                                {card.title}
                            </p>
                            <p className="font-[family-name:var(--font-heading)] font-bold text-2xl text-[#111827] mt-1">
                                {card.value}
                            </p>
                        </div>
                        <div
                            className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
                            style={{ backgroundColor: card.accent }}
                        >
                            <card.icon size={18} style={{ color: card.iconColor }} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Reviews section */}
            {dashboardData.ratings.length > 0 && (
                <div>
                    <h2 className="font-[family-name:var(--font-heading)] font-semibold text-lg text-[#111827] mb-4">
                        Recent Reviews
                    </h2>

                    <div className="bg-white rounded-[12px] border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.08)] divide-y divide-[#F3F4F6]">
                        {dashboardData.ratings.map((review, index) => (
                            <div
                                key={index}
                                className="flex max-sm:flex-col gap-5 sm:items-start justify-between p-5 sm:p-6"
                            >
                                {/* Reviewer + review text */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Image
                                            src={review.user.image}
                                            alt={review.user.name}
                                            className="w-9 h-9 rounded-full object-cover shrink-0"
                                            width={36}
                                            height={36}
                                        />
                                        <div>
                                            <p className="text-sm font-medium text-[#111827]">
                                                {review.user.name}
                                            </p>
                                            <p className="text-xs text-[#9CA3AF]">
                                                {new Date(review.createdAt).toLocaleDateString("en-ZA", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-[#6B7280] leading-relaxed max-w-md">
                                        {review.review}
                                    </p>
                                </div>

                                {/* Product info + stars + action */}
                                <div className="flex flex-col gap-3 sm:items-end shrink-0">
                                    <div className="sm:text-right">
                                        <p className="text-xs text-[#9CA3AF]">
                                            {review.product?.category}
                                        </p>
                                        <p className="text-sm font-medium text-[#111827] max-w-[180px] sm:text-right">
                                            {review.product?.name}
                                        </p>
                                        {/* Star rating — amber to match ProductCard */}
                                        <div className="flex items-center gap-0.5 mt-1 sm:justify-end">
                                            {Array(5)
                                                .fill("")
                                                .map((_, i) => (
                                                    <StarIcon
                                                        key={i}
                                                        size={13}
                                                        className="text-transparent"
                                                        fill={review.rating >= i + 1 ? "#F59E0B" : "#E5E7EB"}
                                                    />
                                                ))}
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.push(`/product/${review.product.id}`)}
                                    >
                                        View Product
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty state for reviews */}
            {dashboardData.ratings.length === 0 && (
                <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-10 text-center">
                    <p className="text-sm text-[#6B7280]">No reviews yet. Reviews from buyers will appear here.</p>
                </div>
            )}
        </div>
    );
}
