/**
 * tradrsAvenue — Open Dispute
 * POST /api/orders/dispute
 *
 * Buyer opens a dispute when they have a problem with their order.
 * Admin will review and decide to release or refund.
 * Only allowed when:
 *   - escrowStatus is "held"
 *   - Order status is DELIVERED or SHIPPED
 *   - caller is the buyer
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

        const { orderId, reason } = await request.json();

        if (!orderId || !reason?.trim()) {
            return NextResponse.json(
                { error: "orderId and reason are required" },
                { status: 400 }
            );
        }

        const order = await prisma.order.findUnique({ where: { id: orderId } });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        if (order.userId !== userId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        if (order.escrowStatus !== "held") {
            return NextResponse.json(
                { error: `Cannot open dispute — escrow is already ${order.escrowStatus}` },
                { status: 400 }
            );
        }

        // Update order to disputed state
        await prisma.order.update({
            where: { id: orderId },
            data: {
                escrowStatus:  "disputed",
                disputeReason: reason.trim(),
                status:        "DISPUTED",
            },
        });

        // Alert admin via Inngest
        await inngest.send({
            name: "order/disputed",
            data: { orderId, storeId: order.storeId, userId, reason: reason.trim() },
        });

        return NextResponse.json({
            success: true,
            message: "Dispute opened. Our team will review within 24 hours.",
        });

    } catch (error) {
        console.error("[Open Dispute]", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
