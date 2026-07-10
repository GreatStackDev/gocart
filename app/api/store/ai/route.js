import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { openai } from "@/configs/openai";
import { NextResponse } from "next/server";

async function main(base64Image, mimeType) {
  const messages = [
    {
      role: "system",
      content: `
              You are a product listing assistant for an e-commerce store. Your job is to analyse an image of a product and generate structured data.
              
              Respond ONLY with the raw JSON ( no code blocks, no markdown , no explaination)

              The JSON must STRICTLY FOLLOW this schema:
              {
                "name": string,     // Short produnct name
                "description": string, // Marketing-Friendly description of the product
              }
              `,
    },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Analyse this image and ruturn a product name and description in JSON format",
        },
        {
          type: "image_url",
          image_url: {
            url: `data:${mimeType};base64,${base64Image}`,
          },
        },
      ],
    },
  ];

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL,
    messages,
  });

  const raw = response.choices[0].message.content;

  // removed ```json or ``` wrappers of present
  const cleaned = raw.replace(/```json```/g, "");

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (error) {
    throw new Error("Failed to parse AI response");
  }

  return parsed;
}

export async function POST(request) {
  try {
    const { userId } = await getAuth(request);
    const isSeller = await authSeller(userId);

    const { base64Image, mimeType } = await request.json();
    if (!base64Image || !mimeType) {
      return NextResponse.json(
        { message: "Base64 image and mime type are required." },
        { status: 400 },
      );
    }

    if (!isSeller) {
      return NextResponse.json(
        { message: "You are not authorized to perform this action." },
        { status: 401 },
      );
    }

    const result = await main(base64Image, mimeType);
    return NextResponse.json({ ...result });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to generate product data from AI." },
      { status: 500 },
    );
  }
}
