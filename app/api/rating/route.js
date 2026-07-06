// add new rating

import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { orderId, productId, rating, review } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    // Check if the order exists and belongs to the user
    const order = await prisma.order.findUnique({
      where: { id: orderId, userId },
    });

    if (!order) {
      return NextResponse.json(
        { error: "order not found or you don't have access" },
        { status: 404 },
      );
    }

    //check if user already rated this product
    const isAlreadyRated = await prisma.rating.findFirst({
      where: {
        productId,
        orderId,
      },
    });

    if (isAlreadyRated) {
      return NextResponse.json(
        { error: "you already rated this product" },
        { status: 400 },
      );
    }

    // Create the review
    const response = await prisma.rating.create({
      data: {
        orderId,
        productId,
        userId,
        rating,
        review,
      },
    });

    return NextResponse.json({
      message: "rating added successfully",
      success: true,
      rating: response,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 },
    );
  }
}

// get all ratings for a user
export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    const ratings = await prisma.rating.findMany({
      where: {
        userId,
      },
    });
    return NextResponse.json({ ratings });
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 },
    );
  }
}
