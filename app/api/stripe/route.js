import Stripe from "stripe";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const body = await request.text();
    const sig = request.get("stripe-signature");

    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    const handlePaymentIntent = async (paymentIntentId, isPaid) => {
      const session = await stripe.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      const { orderIds, userId, appId } = session.data[0].metadata;

      if (appId !== "gocart") {
        return NextResponse.json(
          { received: true, error: "unauthorized request" },
          { status: 400 },
        );
      }

      const orderIdArray = orderIds.split(",");

      if (isPaid) {
        //mark order as paid
        await Promise.all(
          orderIdArray.map(async (orderId) => {
            await prisma.order.update({
              where: { id: orderId },
              data: { isPaid: true },
            });
          }),
        );
        //delete cart fromn user
        await prisma.user.update({
          where: { id: userId },
          data: { cart: {} },
        });
      } else {
        await Promise.all(
          orderIdArray.map(async (orderId) => {
            await prisma.order.delete({
              where: { id: orderId },
            });
          }),
        );

        //delete cart fromn user
      }
    };

    co;

    switch (event.type) {
      case "payment_intent.succeeded":
        {
          await handlePaymentIntent(event.data.object.id, true);
        }

        break;

      case "payment_intent.cancelled":
        {
          await handlePaymentIntent(event.data.object.id, false);
        }
        break;

      default:
        console.log("unhandled event type", event.type);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export const config = { api: { bodyParser: false } };
