import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Check if seller
        const storeId = await authSeller(userId);
        
        let conversations;

        if (storeId) {
            // Fetch store conversations
            conversations = await prisma.conversation.findMany({
                where: { storeId },
                include: {
                    buyer: { select: { name: true, image: true } },
                    order: { select: { id: true, total: true, status: true } },
                    messages: {
                        orderBy: { createdAt: 'desc' },
                        take: 1
                    }
                },
                orderBy: { createdAt: 'desc' }
            });
        } else {
            // Fetch buyer conversations
            conversations = await prisma.conversation.findMany({
                where: { buyerId: userId },
                include: {
                    store: { select: { name: true, logo: true } },
                    order: { select: { id: true, total: true, status: true } },
                    messages: {
                        orderBy: { createdAt: 'desc' },
                        take: 1
                    }
                },
                orderBy: { createdAt: 'desc' }
            });
        }

        return NextResponse.json({ conversations });
    } catch (error) {
        console.error(`[GET /api/conversations] ${error.message}`);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
