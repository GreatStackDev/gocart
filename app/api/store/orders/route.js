import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


// update seller order status

export async function POST(request) {
  try {
    const { userId } = await getAuth(request);
    const storeId = await authSeller(userId);

    if (!storeId) {
      return NextResponse.json(
        { message: "You are not authorized to perform this action" },
        { status: 403 },
      );
    }

    const { orderId, status } = await request.json();

    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return NextResponse.json(
      { message: "Order updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to update order status" },
      { status: 500 },
    );
  }
}

// get all orders from a seller

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const storeId = await authSeller(userId);

    if (!storeId) {
      return NextResponse.json(
        { message: "You are not authorized to perform this action" },
        { status: 401 },
      );
    }

    const orders = await prisma.order.findMany({
      where: {
        storeId,
      },
      include: {
        user: true,
        address: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}
