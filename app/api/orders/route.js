import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { PaymentMethod } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const { userId, has } = getAuth(request);
    if (!userId) {
      return NextResponse.json(
        { error: "You are not logged in" },
        { status: 401 },
      );
    }

    const { addressId, paymentMethod, items, couponCode } =
      await request.json();
    if (
      !addressId ||
      !paymentMethod ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    let coupon = null;

    if (couponCode) {
      coupon = await prisma.coupon.findUnique({
        where: {
          code: couponCode,
        },
      });
      if (!coupon) {
        return NextResponse.json(
          { error: "Coupon not found" },
          { status: 400 },
        );
      }
    }
    //check if coupon is applicable for new user
    if (couponCode && coupon.forNewUser) {
      const userOrders = await prisma.order.findMany({ where: { userId } });
      if (userOrders.length > 0) {
        return NextResponse.json(
          { error: "Coupon is only for new users" },
          { status: 400 },
        );
      }
    }

    const isPlusUser = has({ plan: "plus" });

    if (couponCode && coupon.forMember) {
      if (!isPlusUser) {
        return NextResponse.json(
          { error: "Coupon is only for plus members" },
          { status: 400 },
        );
      }
    }

    //Group orders by storeId using map

    const ordersByStore = new Map();
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.id },
      });
      const storeId = product.storeId;
      if (!ordersByStore.has(storeId)) {
        ordersByStore.set(storeId, []);
      }
      ordersByStore.get(storeId).push({
        ...item,
        price: product.price,
      });
    }

    let orderIds = [];

    let fullAmount = 0;

    let isShippingFeeAdded = false;
    //create order for each seller

    for (const [storeId, sellerItems] of ordersByStore.entries()) {
      let total = sellerItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      );

      if (couponCode) {
        total -= (total * coupon.discount) / 100;
      }

      if (!isPlusUser && !isShippingFeeAdded) {
        total += 6.99;
        isShippingFeeAdded = true;
      }

      fullAmount += parseFloat(total.toFixed(2));

      //create order
      const order = await prisma.order.create({
        data: {
          userId,
          storeId,
          addressId,
          paymentMethod,
          total: parseFloat(total.toFixed(2)),
          paymentMethod,
          isCouponUsed: coupon ? true : false,
          coupon: coupon ? coupon : {},
          orderItems: {
            create: sellerItems.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      });

      orderIds.push(order.id);
    }

    //clear the cart
    await prisma.user.update({
      where: { id: userId },
      data: { cart: {} },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully",
        orderIds,
        fullAmount,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

//get all oredrs for a user

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    const orders = await prisma.order.findMany({
      where: {
        userId,
        OR: [
          { paymentMethod: PaymentMethod.COD },
          { AND: [{ paymentMethod: PaymentMethod.STRIPE }, { isPaid: true }] },
        ],
      },
      include: {
        orderItems: { include: { product: true } },
        address: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
