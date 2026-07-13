import { ImageResponse } from "next/og";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get("productId");

        if (!productId) {
            return new Response("Product ID is required", { status: 400 });
        }

        const product = await prisma.product.findUnique({
            where: { id: productId },
            include: { store: true },
        });

        if (!product) {
            return new Response("Product not found", { status: 404 });
        }

        const imageUrl = product.images?.[0] || "https://tradrsavenue.co.za/placeholder.png";
        const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "R";

        return new ImageResponse(
            (
                <div
                    style={{
                        display: "flex",
                        height: "100%",
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexDirection: "row",
                        backgroundColor: "#FAFAF7",
                        padding: "60px",
                        border: "12px solid #1E1B4B",
                    }}
                >
                    <div style={{ display: "flex", flexDirection: "column", width: "50%", gap: "20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{ display: "flex", color: "#1E1B4B", fontSize: "32px", fontWeight: "bold" }}>
                                tradrs
                            </div>
                            <div style={{ display: "flex", color: "#F59E0B", fontSize: "32px", fontWeight: "bold" }}>
                                Avenue
                            </div>
                        </div>
                        <div style={{ display: "flex", color: "#111827", fontSize: "64px", fontWeight: "bold", lineHeight: 1.1, marginTop: "20px" }}>
                            {product.name}
                        </div>
                        <div style={{ display: "flex", color: "#1E1B4B", fontSize: "48px", fontWeight: "bold", marginTop: "10px" }}>
                            {currency}{product.price}
                        </div>
                        {product.store && (
                            <div style={{ display: "flex", alignItems: "center", gap: "15px", marginTop: "40px", backgroundColor: "#EEF2FF", padding: "15px 25px", borderRadius: "12px", width: "fit-content" }}>
                                <div style={{ display: "flex", color: "#312E81", fontSize: "24px", fontWeight: "600" }}>
                                    Sold by {product.store.name}
                                </div>
                            </div>
                        )}
                    </div>
                    <div style={{ display: "flex", width: "40%", height: "100%", alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF", borderRadius: "24px", overflow: "hidden", border: "2px solid #E5E7EB" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imageUrl} alt={product.name} style={{ objectFit: "contain", width: "100%", height: "100%" }} />
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        );
    } catch (error) {
        console.error("[OG Image Generation]", error);
        return new Response(`Failed to generate image`, { status: 500 });
    }
}
