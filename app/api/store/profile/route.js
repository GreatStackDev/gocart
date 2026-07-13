import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import authSeller from "@/middlewares/authSeller";

export async function PUT(request) {
  try {
    const { userId } = getAuth(request);
    const isSeller = await authSeller(userId);
    
    if (!isSeller) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, email, contact, address, logoUrl } = body;

    // Validate
    if (!name || !email || !contact || !address) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Update store
    const updatedStore = await prisma.store.update({
      where: { userId },
      data: {
        name,
        description,
        email,
        contact,
        address,
        ...(logoUrl && { logo: logoUrl }) // Only update logo if provided
      },
    });

    return NextResponse.json({ success: true, store: updatedStore });
  } catch (error) {
    console.error("Store update error:", error);
    return NextResponse.json({ error: "Failed to update store profile" }, { status: 500 });
  }
}
