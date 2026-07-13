/**
 * tradrsAvenue — Submit Verification Request (Seller)
 * POST /api/store/verify
 *
 * Receives the ID photo (ImageKit URL).
 */

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";

export async function POST(request) {
    try {
        const { userId, store } = await authSeller(request);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
        }

        const { idDocUrl, selfieUrl } = await request.json();

        if (!idDocUrl) {
            return NextResponse.json({ error: "ID document is required" }, { status: 400 });
        }

        // Upsert request (allow re-submission if rejected)
        const verificationRequest = await prisma.verificationRequest.upsert({
            where: { storeId: store.id },
            update: {
                idDocUrl,
                selfieUrl,
                status: "pending",
                submittedAt: new Date(),
            },
            create: {
                storeId: store.id,
                idDocUrl,
                selfieUrl,
            },
        });

        return NextResponse.json({ success: true, verificationRequest });

    } catch (error) {
        console.error("[Store Verify]", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
