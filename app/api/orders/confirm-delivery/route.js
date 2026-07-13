import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { orderId } = await request.json();
        
        if (!orderId) {
            return NextResponse.json({ error: "Order ID required" }, { status: 400 });
        }

        const order = await prisma.order.findUnique({ where: { id: orderId } });
        
        if (!order || order.userId !== userId) {
            return NextResponse.json({ error: "Invalid order" }, { status: 400 });
        }

        if (order.status !== 'DELIVERED') {
            return NextResponse.json({ error: "Order must be marked as DELIVERED before confirming" }, { status: 400 });
        }

        if (order.escrowStatus !== 'held') {
            return NextResponse.json({ error: `Funds already ${order.escrowStatus}` }, { status: 400 });
        }

        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: {
                escrowStatus: 'released',
                buyerConfirmedAt: new Date(),
                escrowReleasedAt: new Date()
            }
        });

        // Also update store analytics for totalSales
        await prisma.store.update({
            where: { id: order.storeId },
            data: {
                totalSales: { increment: order.total }
            }
        });

        return NextResponse.json({ order: updatedOrder });
    } catch (error) {
        console.error(`[POST /api/orders/confirm-delivery] ${error.message}`);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
