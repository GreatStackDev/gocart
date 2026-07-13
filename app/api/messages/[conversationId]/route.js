/**
 * tradrsAvenue — Messages for a Conversation
 * GET /api/messages/[conversationId]     → load messages (marks as read)
 * POST /api/messages/send                → send a message
 *
 * Polling: client polls GET every 10 seconds.
 */

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/** Load all messages in a conversation and mark them as read */
export async function GET(request, { params }) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
        }

        const { conversationId } = params;

        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
        });

        if (!conversation) {
            return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
        }

        // Access check: must be buyer or seller
        const store = await prisma.store.findUnique({ where: { userId } });
        const isBuyer  = conversation.buyerId === userId;
        const isSeller = store?.id === conversation.storeId;

        if (!isBuyer && !isSeller) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Load messages
        const messages = await prisma.message.findMany({
            where: { conversationId },
            include: {
                sender: { select: { id: true, name: true, image: true } },
            },
            orderBy: { createdAt: "asc" },
        });

        // Mark incoming messages as read
        await prisma.message.updateMany({
            where: {
                conversationId,
                isRead:   false,
                NOT: { senderId: userId },
            },
            data: { isRead: true },
        });

        return NextResponse.json({ messages });

    } catch (error) {
        console.error("[Messages GET]", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
