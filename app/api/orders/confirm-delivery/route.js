/**
 * tradrsAvenue — Confirm Delivery (Escrow Release)
 * POST /api/orders/confirm-delivery
 *
 * Buyer clicks "I received my order" → escrow released to seller.
 * Only allowed when:
 *   - Order status is DELIVERED
 *   - escrowStatus is "held"
 *   - caller is the buyer of this order
 */

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { inngest } from "@/inngest/client";
import { auth } from "@clerk/nextjs/server";

export async function POST(request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
        }

        const { orderId } = await request.json();
        if (!orderId) {
            return NextResponse.json({ error: "orderId is required" }, { status: 400 });
        }

        const order = await prisma.order.findUnique({ where: { id: orderId } });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // Security: only the buyer can confirm their own order
        if (order.userId !== userId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Validate escrow state
        if (order.escrowStatus !== "held") {
            return NextResponse.json(
                { error: `Escrow is already ${order.escrowStatus}` },
                { status: 400 }
            );
        }

        if (order.status !== "DELIVERED") {
            return NextResponse.json(
                { error: "Order must be DELIVERED before you can confirm receipt" },
                { status: 400 }
            );
        }

        const now = new Date();

        // Release escrow
        await prisma.order.update({
            where: { id: orderId },
            data: {
                escrowStatus:    "released",
                escrowReleasedAt: now,
                buyerConfirmedAt: now,
            },
        });

        // Notify seller via Inngest
        await inngest.send({
            name:  "escrow/released",
            data:  { orderId, storeId: order.storeId, confirmedByBuyer: true },
        });

        return NextResponse.json({
            success: true,
            message: "Delivery confirmed. Funds released to seller.",
        });

    } catch (error) {
        console.error("[Confirm Delivery]", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
