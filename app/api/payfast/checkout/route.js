/**
 * tradrsAvenue — PayFast Checkout Route
 * POST /api/payfast/checkout
 *
 * Creates a PayFast payment form and returns the redirect URL + form fields.
 * PayFast hosted checkout handles card processing on their end.
 *
 * Docs: https://developers.payfast.co.za/docs#step_1_form_fields
 */

import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

// ── PayFast config (from .env) ────────────────────────────────────────────────
const PF_MERCHANT_ID  = process.env.PAYFAST_MERCHANT_ID;
const PF_MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY;
const PF_PASSPHRASE   = process.env.PAYFAST_PASSPHRASE || "";
const IS_SANDBOX      = process.env.PAYFAST_SANDBOX === "true";

const PF_HOST = IS_SANDBOX
    ? "sandbox.payfast.co.za"
    : "www.payfast.co.za";

/**
 * Build MD5 signature for PayFast.
 * Sorts params alphabetically, URL-encodes values, appends passphrase.
 */
function buildSignature(data, passphrase = "") {
    const filtered = Object.fromEntries(
        Object.entries(data).filter(([, v]) => v !== "" && v !== undefined)
    );
    const sorted = Object.keys(filtered)
        .sort()
        .map((k) => `${k}=${encodeURIComponent(filtered[k]).replace(/%20/g, "+")}`)
        .join("&");

    const toHash = passphrase
        ? `${sorted}&passphrase=${encodeURIComponent(passphrase).replace(/%20/g, "+")}`
        : sorted;

    return crypto.createHash("md5").update(toHash).digest("hex");
}

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
        }

        const body = await request.json();
        const { orderId, addressId } = body;

        if (!orderId) {
            return NextResponse.json({ error: "orderId is required" }, { status: 400 });
        }

        // Fetch the order
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                user: true,
                orderItems: { include: { product: true } },
            },
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        if (order.userId !== userId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://tradrsavenue.co.za";

        // Build item name (first product name, truncated)
        const firstItem = order.orderItems[0]?.product?.name || "tradrsAvenue Order";
        const itemName = firstItem.substring(0, 100);

        // PayFast data payload
        const pfData = {
            merchant_id:   PF_MERCHANT_ID,
            merchant_key:  PF_MERCHANT_KEY,
            return_url:    `${baseUrl}/orders?payment=success`,
            cancel_url:    `${baseUrl}/cart?payment=cancelled`,
            notify_url:    `${baseUrl}/api/payfast/notify`,
            name_first:    order.user.name.split(" ")[0] || "Buyer",
            name_last:     order.user.name.split(" ").slice(1).join(" ") || "",
            email_address: order.user.email,
            m_payment_id:  order.id,          // our internal order ID → returned in ITN
            amount:        order.total.toFixed(2),
            item_name:     itemName,
            item_description: `tradrsAvenue order #${order.id.substring(0, 8)}`,
        };

        // Generate signature
        pfData.signature = buildSignature(pfData, PF_PASSPHRASE);

        // Return the PayFast endpoint + form data
        // Frontend will POST a form to this URL with these fields
        return NextResponse.json({
            success: true,
            payfastUrl: `https://${PF_HOST}/eng/process`,
            formData: pfData,
        });

    } catch (error) {
        console.error("[PayFast Checkout]", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
