import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import authSeller from "@/middlewares/authSeller";
import imagekit from "@/configs/imageKit";
import prisma from "@/lib/prisma";

// add new product

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const storeId = await authSeller(userId);
    if (!storeId) {
      return NextResponse.json(
        {
          error: "you are not authorized to add products",
        },
        { status: 401 },
      );
    }

    //get the data from the form
    const formData = await request.formData();

    const name = formData.get("name");
    const description = formData.get("description");
    const price = Number(formData.get("price"));
    const mrp = Number(formData.get("mrp"));

    const category = formData.get("category");
    const image = formData.getAll("images");

    if (
      !name ||
      !description ||
      !price ||
      !category ||
      image.length < 1 ||
      !mrp
    ) {
      return NextResponse.json(
        {
          error: "Missing product information",
        },
        { status: 400 },
      );
    }

    // uploading image to imagekit

    const imagesUrl = await Promise.all(
      image.map(async (image) => {
        const buffer = Buffer.from(await image.arrayBuffer());
        const response = await imagekit.upload({
          file: buffer,
          fileName: image.name,
          folder: "products",
        });
        const url = imagekit.url({
          path: response.filePath,
          tranformation: [
            { quality: "auto" },
            { format: "webp" },
            { width: "1024" },
          ],
        });
        return url;
      }),
    );

    //save product to database

    await prisma.product.create({
      data: {
        name,
        description,
        price,
        mrp,
        category,
        images: imagesUrl,
        storeId,
      },
    });

    return NextResponse.json({
      message: "Product added successfully",
    });
  } catch (error) {
    console.error(`[POST /api/store/product] ${error.message}`, { userId });
    return NextResponse.json({
      error: error.code || error.message,
    }, { status: 400 });
  }
}

// get all products for seller

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const storeId = await authSeller(userId);
    if (!storeId) {
      return NextResponse.json(
        {
          error: "you are not authorized to get products",
        },
        { status: 401 },
      );
    }

    //get all products for seller
    const products = await prisma.product.findMany({
      where: {
        storeId,
      },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error(`[GET /api/store/product] ${error.message}`);
    return NextResponse.json({
      error: error.code || error.message,
    }, { status: 400 });
  }
}
