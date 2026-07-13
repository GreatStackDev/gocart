/**
 * tradrsAvenue — Send Message
 * POST /api/messages/send
 */

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { inngest } from "@/inngest/client";

export async function POST(request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
        }

        const { conversationId, body } = await request.json();

        if (!conversationId || !body?.trim()) {
            return NextResponse.json({ error: "conversationId and body are required" }, { status: 400 });
        }

        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
        });

        if (!conversation) {
            return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
        }

        // Access check
        const store = await prisma.store.findUnique({ where: { userId } });
        const isBuyer  = conversation.buyerId === userId;
        const isSeller = store?.id === conversation.storeId;

        if (!isBuyer && !isSeller) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Create message
        const message = await prisma.message.create({
            data: {
                conversationId,
                senderId: userId,
                body: body.trim(),
            },
            include: {
                sender: { select: { id: true, name: true, image: true } },
            },
        });

        // Fire inngest event (optional, for email notifications if offline)
        await inngest.send({
            name: "message/sent",
            data: { messageId: message.id, conversationId },
        });

        return NextResponse.json({ message });

    } catch (error) {
        console.error("[Message Send]", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
