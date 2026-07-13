import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import authSeller from "@/middlewares/authSeller";
import prisma from "@/lib/prisma";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        const storeId = await authSeller(userId);

        if (!storeId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Fetch all orders for this store
        const orders = await prisma.order.findMany({
            where: { storeId },
            orderBy: { createdAt: 'asc' },
            select: {
                total: true,
                createdAt: true,
            }
        });

        // Group by month for chart
        const monthlyData = {};
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        orders.forEach(order => {
            const date = new Date(order.createdAt);
            const monthKey = `${months[date.getMonth()]} ${date.getFullYear()}`;
            
            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = { name: monthKey, sales: 0, orders: 0 };
            }
            monthlyData[monthKey].sales += order.total;
            monthlyData[monthKey].orders += 1;
        });

        const chartData = Object.values(monthlyData);

        return NextResponse.json({ chartData });
    } catch (error) {
        console.error(`[GET /api/store/analytics] ${error.message}`);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
