'use client'

import { useEffect, useState } from "react"
import { useAuth, useUser } from "@clerk/nextjs"
import axios from "axios"
import toast from "react-hot-toast"
import Loading from "@/components/Loading"
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar
} from 'recharts'
import { TrendingUpIcon, ActivityIcon } from "lucide-react"

export default function AnalyticsPage() {
    const { user } = useUser()
    const { getToken } = useAuth()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchAnalytics = async () => {
        try {
            const token = await getToken()
            const response = await axios.get("/api/store/analytics", {
                headers: { Authorization: `Bearer ${token}` }
            })
            setData(response.data.chartData || [])
        } catch (error) {
            console.error("Analytics fetch error:", error)
            toast.error("Failed to load analytics data")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user) fetchAnalytics()
    }, [user])

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white border border-gray-200 p-3 rounded-lg shadow-lg">
                    <p className="font-semibold text-[#1E1B4B] mb-2">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {entry.name}: {entry.name === 'Sales' ? `R ${entry.value}` : entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return !loading ? (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-[family-name:var(--font-heading)] font-bold text-[#1E1B4B]">
                    Store Analytics
                </h1>
                <p className="text-sm text-[#6B7280] mt-1">Track your sales performance and order volume over time.</p>
            </div>

            {data.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-80 bg-white border border-gray-100 rounded-xl">
                    <ActivityIcon className="w-12 h-12 text-[#9CA3AF] mb-4" />
                    <h2 className="text-[#1E1B4B] font-semibold text-lg">No Data Available</h2>
                    <p className="text-[#6B7280] mt-1 text-sm">You haven't received any orders yet. Data will appear here once sales start.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Sales Chart */}
                    <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <TrendingUpIcon className="w-5 h-5 text-[#F59E0B]" />
                            <h2 className="font-semibold text-[#1E1B4B]">Revenue Over Time</h2>
                        </div>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dx={-10} tickFormatter={(val) => `R ${val}`} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Line type="monotone" dataKey="sales" name="Sales" stroke="#F59E0B" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Orders Chart */}
                    <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <ActivityIcon className="w-5 h-5 text-[#3B82F6]" />
                            <h2 className="font-semibold text-[#1E1B4B]">Order Volume</h2>
                        </div>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dx={-10} />
                                    <Tooltip content={<CustomTooltip />} cursor={{fill: '#F3F4F6'}} />
                                    <Bar dataKey="orders" name="Orders" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}
        </div>
    ) : <Loading />
}
