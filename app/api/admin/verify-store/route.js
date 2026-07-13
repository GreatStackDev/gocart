/**
 * tradrsAvenue — Approve/Reject Verification Request (Admin)
 * POST /api/admin/verify-store
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

        const { storeId, action, reviewNote } = await request.json(); // action: "approve" | "reject"

        if (!storeId || !["approve", "reject"].includes(action)) {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 });
        }

        const status = action === "approve" ? "approved" : "rejected";
        const verificationStatus = action === "approve" ? "verified" : "unverified";

        const requestUpdate = await prisma.verificationRequest.update({
            where: { storeId },
            data: {
                status,
                reviewNote,
                reviewedAt: new Date(),
            },
        });

        await prisma.store.update({
            where: { id: storeId },
            data: { verificationStatus },
        });

        return NextResponse.json({ success: true, status });

    } catch (error) {
        console.error("[Admin Verify Store]", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
