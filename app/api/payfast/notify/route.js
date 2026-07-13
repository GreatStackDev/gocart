/**
 * tradrsAvenue — PayFast ITN (Instant Transaction Notification) Webhook
 * POST /api/payfast/notify
 *
 * PayFast calls this URL after every payment attempt.
 * We verify the signature, mark the order as paid, set escrow = "held",
 * and schedule the 7-day auto-release via Inngest.
 *
 * Docs: https://developers.payfast.co.za/docs#instant-transaction-notification
 */

import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { inngest } from "@/inngest/client";

const PF_PASSPHRASE = process.env.PAYFAST_PASSPHRASE || "";
const IS_SANDBOX    = process.env.PAYFAST_SANDBOX === "true";

/**
 * Verify PayFast ITN signature.
 * Receives URL-encoded form body, reconstructs signature without the
 * signature field itself, then compares.
 */
function verifySignature(params, passphrase = "") {
    const { signature, ...rest } = params;

    const sorted = Object.keys(rest)
        .sort()
        .filter((k) => rest[k] !== "" && rest[k] !== undefined)
        .map((k) => `${k}=${encodeURIComponent(rest[k]).replace(/%20/g, "+")}`)
        .join("&");

    const toHash = passphrase
        ? `${sorted}&passphrase=${encodeURIComponent(passphrase).replace(/%20/g, "+")}`
        : sorted;

    const computed = crypto.createHash("md5").update(toHash).digest("hex");
    return computed === signature;
}

export async function POST(request) {
    try {
        // PayFast sends application/x-www-form-urlencoded
        const formText = await request.text();
        const params   = Object.fromEntries(new URLSearchParams(formText));

        const {
            payment_status,
            m_payment_id: orderId,
            pf_payment_id: payfastPaymentId,
            amount_gross: amountGross,
        } = params;

        // ── 1. Verify signature ──────────────────────────────────────────────
        if (!IS_SANDBOX && !verifySignature(params, PF_PASSPHRASE)) {
            console.error("[PayFast ITN] Signature verification failed");
            return new Response("Invalid signature", { status: 400 });
        }

        // ── 2. Only process COMPLETE payments ────────────────────────────────
        if (payment_status !== "COMPLETE") {
            console.log(`[PayFast ITN] Status ${payment_status} for order ${orderId} — skipping`);
            return new Response("OK", { status: 200 });
        }

        // ── 3. Find the order ─────────────────────────────────────────────────
        const order = await prisma.order.findUnique({ where: { id: orderId } });

        if (!order) {
            console.error(`[PayFast ITN] Order not found: ${orderId}`);
            return new Response("Order not found", { status: 404 });
        }

        if (order.isPaid) {
            // Idempotency: already processed
            return new Response("OK", { status: 200 });
        }

        // ── 4. Validate amount (basic check) ─────────────────────────────────
        const paidAmount = parseFloat(amountGross);
        if (Math.abs(paidAmount - order.total) > 0.01) {
            console.error(`[PayFast ITN] Amount mismatch: expected ${order.total}, got ${paidAmount}`);
            return new Response("Amount mismatch", { status: 400 });
        }

        // ── 5. Mark order as paid + set escrow ───────────────────────────────
        await prisma.order.update({
            where: { id: orderId },
            data: {
                isPaid:          true,
                escrowStatus:    "held",
                payfastPaymentId: payfastPaymentId || null,
                status:          "PROCESSING",
            },
        });

        // ── 6. Fire Inngest event → schedules auto-release after 7 days ──────
        await inngest.send({
            name: "order/paid",
            data: { orderId, storeId: order.storeId, userId: order.userId },
        });

        console.log(`[PayFast ITN] Order ${orderId} marked paid. Escrow: held.`);
        return new Response("OK", { status: 200 });

    } catch (error) {
        console.error("[PayFast ITN] Error:", error);
        return new Response("Internal server error", { status: 500 });
    }
}
