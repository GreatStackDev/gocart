import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const store = await prisma.store.findFirst({
      where: { userId: userId },
    });

    if (!store) {
      return NextResponse.json({ status: "not_found" });
    }

    return NextResponse.json({ status: store.status });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { 
      name, 
      username, 
      description, 
      email, 
      contact, 
      address, 
      logoUrl, 
      idDocUrl 
    } = body;

    if (!name || !username || !description || !email || !contact || !address || !logoUrl || !idDocUrl) {
      return NextResponse.json(
        { error: "Missing required store or verification information" },
        { status: 400 }
      );
    }

    // check if user already has a store
    const existingStore = await prisma.store.findFirst({
      where: { userId: userId },
    });

    if (existingStore) {
      return NextResponse.json({ status: existingStore.status });
    }

    // check if username is already taken
    const isUsernameTaken = await prisma.store.findFirst({
      where: { username: username.toLowerCase() },
    });

    if (isUsernameTaken) {
      return NextResponse.json(
        { error: "Username is already taken. Please choose another one." },
        { status: 400 }
      );
    }

    // Run in a transaction to ensure both Store and VerificationRequest are created
    await prisma.$transaction(async (tx) => {
      const newStore = await tx.store.create({
        data: {
          userId,
          name,
          username: username.toLowerCase(),
          description,
          email,
          contact,
          logo: logoUrl,
          address,
          status: "pending", // explicitly set
        },
      });

      await tx.verificationRequest.create({
        data: {
          storeId: newStore.id,
          idDocUrl: idDocUrl,
          status: "pending",
        }
      });

      await tx.user.update({
        where: { id: userId },
        data: { isSeller: true },
      });
    });

    return NextResponse.json({ success: true, message: "Store and verification submitted successfully" });
  } catch (error) {
    console.error("Store creation error:", error);
    return NextResponse.json({ error: "Failed to create store" }, { status: 500 });
  }
}
