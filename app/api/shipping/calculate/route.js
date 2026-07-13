/**
 * tradrsAvenue — Calculate Shipping Cost
 * POST /api/shipping/calculate
 */

import { NextResponse } from "next/server";
import { calculateShipping } from "@/lib/shipping";
import prisma from "@/lib/prisma";

export async function POST(request) {
    try {
        const { storeId, addressId, items } = await request.json();

        if (!storeId || !addressId || !items) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const store = await prisma.store.findUnique({ where: { id: storeId } });
        const address = await prisma.address.findUnique({ where: { id: addressId } });

        if (!store || !address) {
            return NextResponse.json({ error: "Store or address not found" }, { status: 404 });
        }

        // Calculate total weight (simplified, assuming 1kg default per item if not set)
        let totalWeightKg = 0;
        for (const item of items) {
            const product = await prisma.product.findUnique({ where: { id: item.productId } });
            const itemWeight = product?.weightKg || 1;
            totalWeightKg += itemWeight * item.quantity;
        }

        const cost = calculateShipping(
            store.province,
            address.state, // mapping state to province
            totalWeightKg,
            store.freeShipping
        );

        return NextResponse.json({ cost });

    } catch (error) {
        console.error("[Shipping Calculate]", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
