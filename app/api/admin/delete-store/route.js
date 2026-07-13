/**
 * tradrsAvenue — Delete Store (Admin)
 * POST /api/admin/delete-store
 */

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(request) {
    try {
        const { userId } = await auth();
        // Assuming admin check is done via Clerk metadata or separate table
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || user.email !== process.env.ADMIN_EMAIL) { // Basic admin check
             return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { storeId } = await request.json();

        if (!storeId) {
            return NextResponse.json({ error: "Store ID is required" }, { status: 400 });
        }

        // Delete store (cascading deletes handled by Prisma if configured, otherwise manual deletion might be needed for products, orders, etc.)
        // Note: In a real production system, you might want a soft delete instead.
        await prisma.store.delete({
            where: { id: storeId },
        });

        return NextResponse.json({ success: true, message: "Store deleted" });

    } catch (error) {
        console.error("[Admin Delete Store]", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
