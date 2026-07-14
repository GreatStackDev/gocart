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

        const users = await prisma.user.findMany({
            include: {
                store: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        status: true,
                        plan: true,
                        isActive: true,
                    },
                },
                _count: {
                    select: {
                        buyerOrders: true,
                        ratings: true,
                    },
                },
            },
            orderBy: {
                name: "asc",
            },
        });

        return NextResponse.json({ users });
    } catch (error) {
        console.error("[admin/users]", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch users" },
            { status: 500 }
        );
    }
}
