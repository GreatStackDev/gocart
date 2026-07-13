/**
 * tradrsAvenue — Manage Store Categories
 * GET /api/store/categories
 * POST /api/store/categories
 */

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";

export async function GET(request) {
    try {
        const { userId, store } = await authSeller(request);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
        }

        return NextResponse.json({ categories: store.categories });
    } catch (error) {
        console.error("[Store Categories GET]", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { userId, store } = await authSeller(request);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
        }

        const { categories } = await request.json();

        if (!Array.isArray(categories)) {
            return NextResponse.json({ error: "Categories must be an array" }, { status: 400 });
        }

        const updatedStore = await prisma.store.update({
            where: { id: store.id },
            data: { categories },
        });

        return NextResponse.json({ success: true, categories: updatedStore.categories });

    } catch (error) {
        console.error("[Store Categories POST]", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
