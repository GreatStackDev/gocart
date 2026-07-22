//verify coupon

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(request) {
  try {
    const { userId, has } = getAuth(request);
    const { code } = await request.json();

    // findFirst supports filtering on non-unique fields like expiresAt
    const coupon = await prisma.coupon.findFirst({
      where: {
        code: code.toUpperCase(),
        expiresAt: { gt: new Date() },
      },
    });

    if (!coupon) {
      console.warn(`[POST /api/coupon] Coupon "${code}" not found or expired`, { userId });
      return NextResponse.json(
        { error: "That coupon code doesn't exist or has already expired" },
        { status: 404 },
      );
    }

    if (coupon.forNewUser) {
      const userOrders = await prisma.order.findMany({ where: { userId } });
      if (userOrders.length > 0) {
        console.info(`[POST /api/coupon] Coupon "${code}" rejected — not a new user`, { userId });
        return NextResponse.json(
          { error: "This coupon is for first-time shoppers only" },
          { status: 400 },
        );
      }
    }

    if (coupon.forMember) {
      const hasPlusPlan = has({ plan: "plus" });
      if (!hasPlusPlan) {
        console.info(`[POST /api/coupon] Coupon "${code}" rejected — not a Plus member`, { userId });
        return NextResponse.json(
          { error: "This coupon is exclusive to tradrsAvenue Plus members" },
          { status: 400 },
        );
      }
    }

    console.log(`[POST /api/coupon] Coupon "${code}" applied successfully`, { userId });
    return NextResponse.json(coupon);
  } catch (error) {
    console.error(`[POST /api/coupon] Unexpected error: ${error.message}`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
