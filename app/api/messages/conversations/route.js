/**
 * tradrsAvenue — Conversations List
 * GET /api/messages/conversations
 *
 * Buyer → returns their conversations
 * Seller → returns all conversations for their store
 */

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
        }

        // Check if user is a seller
        const store = await prisma.store.findUnique({ where: { userId } });

        let conversations;

        if (store) {
            // Seller: get all conversations for their store
            conversations = await prisma.conversation.findMany({
                where: { storeId: store.id },
                include: {
                    buyer:    { select: { id: true, name: true, image: true } },
                    order:    { select: { id: true, total: true, status: true } },
                    messages: {
                        orderBy: { createdAt: "desc" },
                        take: 1,
                    },
                },
                orderBy: { createdAt: "desc" },
            });
        } else {
            // Buyer: get their own conversations
            conversations = await prisma.conversation.findMany({
                where: { buyerId: userId },
                include: {
                    store:    { select: { id: true, name: true, logo: true } },
                    order:    { select: { id: true, total: true, status: true } },
                    messages: {
                        orderBy: { createdAt: "desc" },
                        take: 1,
                    },
                },
                orderBy: { createdAt: "desc" },
            });
        }

        // Count unread messages per conversation
        const withUnread = await Promise.all(
            conversations.map(async (c) => {
                const unreadCount = await prisma.message.count({
                    where: {
                        conversationId: c.id,
                        isRead:         false,
                        // Unread = not sent by current user
                        NOT: { senderId: userId },
                    },
                });
                return { ...c, unreadCount };
            })
        );

        return NextResponse.json({ conversations: withUnread });

    } catch (error) {
        console.error("[Conversations GET]", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

/**
 * POST /api/messages/conversations
 * Create a new conversation for an order (buyer initiates).
 */
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

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { store: true },
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        if (order.userId !== userId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Upsert — one conversation per order
        const conversation = await prisma.conversation.upsert({
            where:  { orderId },
            update: {},
            create: {
                orderId,
                buyerId: userId,
                storeId: order.storeId,
            },
        });

        return NextResponse.json({ conversation });

    } catch (error) {
        console.error("[Conversations POST]", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
