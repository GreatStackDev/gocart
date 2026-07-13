import { inngest } from "./client";
import prisma from "@/lib/prisma";

// Inngest function to save user data to a database
export const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-creation",
    triggers: [{ event: "clerk/user.created" }],
  },
  async ({ event }) => {
    const { data } = event;
    await prisma.user.create({
      data: {
        id: event.data.id,
        email: data.email_addresses[0].email_address,
        name: `${data.first_name} ${data.last_name}`,
        image: data.image_url,
      },
    });
  },
);

// Inngest Function to update user data in database
export const syncUserUpdation = inngest.createFunction(
  {
    id: "sync-user-updation",
    triggers: [{ event: "clerk/user.updated" }],
  },
  async ({ event }) => {
    const { data } = event;
    await prisma.user.update({
      where: {
        id: event.data.id,
      },
      data: {
        email: data.email_addresses[0].email_address,
        name: `${data.first_name} ${data.last_name}`,
        image: data.image_url,
      },
    });
  },
);

// Inngest function to delete user from database
export const syncUserDeletion = inngest.createFunction(
  {
    id: "sync-user-deletion",
    triggers: [{ event: "clerk/user.deleted" }],
  },
  async ({ event }) => {
    const { data } = event;
    await prisma.user.deleteMany({
      where: {
        id: event.data.id,
      },
    });
  },
);

// inngest function to delete coupon on expiry
export const deleteCouponOnExpiry = inngest.createFunction(
  {
    id: "delete-coupon-on-expiry",
    triggers: [{ event: "app/coupon.expired" }],
  },
  async ({ event, step }) => {
    const { data } = event;
    const expiryDate = new Date(data.expiresAt || data.expires_at);
    await step.sleepUntil("wait-for-expiry", expiryDate);

    await step.run("delete-coupon-from-database", async () => {
      await prisma.coupon.delete({
        where: {
          id: data.id,
        },
      });
    });
  },
);

// Escrow Auto-Release Logic
export const autoReleaseEscrow = inngest.createFunction(
  {
    id: "auto-release-escrow",
    triggers: [{ event: "app/order.delivered" }]
  },
  async ({ event, step }) => {
    const { orderId } = event.data;

    // Wait for 7 days
    await step.sleep("wait-for-escrow", "7d");

    // Check if the order is still "held"
    await step.run("release-escrow-funds", async () => {
      const order = await prisma.order.findUnique({ where: { id: orderId } });
      
      if (order && order.escrowStatus === "held") {
        await prisma.order.update({
          where: { id: orderId },
          data: { 
            escrowStatus: "released", 
            escrowReleasedAt: new Date(),
            autoReleaseAt: new Date()
          }
        });

        // Update seller sales
        await prisma.store.update({
            where: { id: order.storeId },
            data: {
                totalSales: { increment: order.total }
            }
        });
      }
    });
  }
);
