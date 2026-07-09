import imagekit from "@/configs/imageKit";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { format } from "date-fns";
import { NextResponse } from "next/server";

// create the store
export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    //Get the data from form
    const formData = await request.formData();

    const name = formData.get("name");
    const username = formData.get("username");
    const description = formData.get("description");
    const email = formData.get("email");
    const contact = formData.get("contact");
    const image = formData.get("image");
    const address = formData.get("address");

    if (
      !name ||
      !username ||
      !description ||
      !email ||
      !contact ||
      !image ||
      !address
    ) {
      return NextResponse.json(
        {
          error: "Missing store information",
        },
        { status: 400 },
      );
    }

    // check if user has a store
    const store = await prisma.store.findFirst({
      where: {
        userId: userId,
      },
    });

    // if store is already registered
    if (store) {
      return NextResponse.json({ status: store.status });
    }

    //check if username is already taken
    const isUsernameTaken = await prisma.store.findFirst({
      where: {
        username: username.toLowerCase(),
      },
    });

    if (isUsernameTaken) {
      return NextResponse.json(
        {
          error: "Username already taken",
        },
        { status: 400 },
      );
    }

    //image upload to image kit

    const buffer = Buffer.from(await image.arrayBuffer());
    const response = await imagekit.upload({
      file: buffer,
      fileName: image.name,
      folder: "logos",
    });

    const optimizedImage = imagekit.url({
      path: response.filePath,
      tranformation: [
        { quality: "auto" },
        { format: "webp" },
        { width: "512" },
      ],
    });

    const newStore = await prisma.store.create({
      data: {
        userId,
        name,
        username: username.toLowerCase(),
        description,
        email,
        contact,
        logo: optimizedImage,
        address,
      },
    });

    //link store to user
    await prisma.user.update({
      where: { id: userId },
      data: { store: { connect: { id: newStore.id } } },
    });

    return NextResponse.json({
      message: "applied, waiting for approval",
    });
  } catch (error) {
    console.error(`[POST /api/store/create] ${error.message}`, { userId });
    return NextResponse.json({
      error: error.code || error.message,
    }, { status: 400 });
  }
}

// check if user has already registerd a store if yes then send status of store

export async function GET(request) {
    try {
      const { userId } = getAuth(request);
      // check if user has a store
      const store = await prisma.store.findFirst({
        where: {
          userId: userId,
        },
      });

      // if store is already registered
      if (store) {
        return NextResponse.json({ status: store.status });
        }
        
        return NextResponse.json({
          status: "not registered"
        });
    } catch (error) {
    console.error(`[GET /api/store/create] ${error.message}`);
    return NextResponse.json({
      error: error.code || error.message,
    }, { status: 400 });
  }
}
