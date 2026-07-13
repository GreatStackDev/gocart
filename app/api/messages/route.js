import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const orderId = searchParams.get("orderId");
        const conversationId = searchParams.get("conversationId");

        let conversation = null;

        if (orderId) {
            // Find by orderId
            conversation = await prisma.conversation.findUnique({
                where: { orderId },
                include: { messages: { orderBy: { createdAt: 'asc' } } }
            });
        } else if (conversationId) {
            // Find by conversationId
            conversation = await prisma.conversation.findUnique({
                where: { id: conversationId },
                include: { messages: { orderBy: { createdAt: 'asc' } } }
            });
        } else {
            return NextResponse.json({ error: "orderId or conversationId required" }, { status: 400 });
        }

        if (!conversation) {
            return NextResponse.json({ messages: [], conversationId: null });
        }

        // Verify the user is part of the conversation (buyer or store owner)
        if (conversation.buyerId !== userId) {
            // Check if they are the store owner
            const store = await prisma.store.findUnique({ where: { userId } });
            if (!store || store.id !== conversation.storeId) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
            }
        }

        return NextResponse.json({ messages: conversation.messages, conversationId: conversation.id });
    } catch (error) {
        console.error(`[GET /api/messages] ${error.message}`);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const bodyData = await request.json();
        const { orderId, conversationId, body } = bodyData;

        if (!body || body.trim() === "") {
            return NextResponse.json({ error: "Message body required" }, { status: 400 });
        }

        let conversation = null;

        if (conversationId) {
            conversation = await prisma.conversation.findUnique({ where: { id: conversationId } });
        } else if (orderId) {
            // Find or create
            conversation = await prisma.conversation.findUnique({ where: { orderId } });
            
            if (!conversation) {
                // We need to create it. Must fetch order to get storeId and verify buyerId.
                const order = await prisma.order.findUnique({ where: { id: orderId } });
                if (!order || order.userId !== userId) {
                    return NextResponse.json({ error: "Invalid order" }, { status: 400 });
                }

                conversation = await prisma.conversation.create({
                    data: {
                        orderId,
                        buyerId: userId,
                        storeId: order.storeId
                    }
                });
            }
        } else {
            return NextResponse.json({ error: "orderId or conversationId required" }, { status: 400 });
        }

        if (!conversation) {
            return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
        }

        // Verify the user is part of the conversation
        if (conversation.buyerId !== userId) {
            const store = await prisma.store.findUnique({ where: { userId } });
            if (!store || store.id !== conversation.storeId) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
            }
        }

        const message = await prisma.message.create({
            data: {
                conversationId: conversation.id,
                senderId: userId,
                body
            }
        });

        return NextResponse.json({ message });
    } catch (error) {
        console.error(`[POST /api/messages] ${error.message}`);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
