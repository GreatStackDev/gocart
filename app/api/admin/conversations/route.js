import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import authAdmin from "@/middlewares/authAdmin";
import prisma from "@/lib/prisma";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        const isAdmin = await authAdmin(userId);

        if (!isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const conversations = await prisma.conversation.findMany({
            include: {
                buyer: { select: { name: true, image: true, id: true } },
                store: { select: { name: true, logo: true, id: true, userId: true } },
                order: { select: { id: true, total: true, status: true } },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ conversations });
    } catch (error) {
        console.error("[admin/conversations]", error);
        return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
    }
}
