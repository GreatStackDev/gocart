/**
 * tradrsAvenue — Generate Social Share Link
 * POST /api/social-share/generate
 */

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authSeller } from "@/middlewares/authSeller";

export async function POST(request) {
    try {
        const { userId, store } = await authSeller(request);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
        }

        const { productId, platform } = await request.json();

        if (!productId || !platform) {
            return NextResponse.json({ error: "productId and platform are required" }, { status: 400 });
        }

        const product = await prisma.product.findFirst({
            where: { id: productId, storeId: store.id },
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found or doesn't belong to this store" }, { status: 404 });
        }

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://tradrsavenue.co.za";
        const shareUrl = `${baseUrl}/product/${productId}?ref=${platform}`;
        const ogImageUrl = `${baseUrl}/api/og?productId=${productId}`;

        const socialShareLink = await prisma.socialShareLink.create({
            data: {
                productId,
                storeId: store.id,
                platform,
                shareUrl,
                ogImageUrl,
            }
        });

        return NextResponse.json({ success: true, socialShareLink });

    } catch (error) {
        console.error("[Social Share Generate]", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
