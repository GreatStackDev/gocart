import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { openai } from "@/configs/openai";
import { NextResponse } from "next/server";

async function main(base64Image, mimeType) {
  const messages = [
    {
      role: "system",
      content: `You are a product listing assistant for an e-commerce store. Your job is to analyse an image of a product and generate structured data.

Respond ONLY with raw JSON — no code blocks, no markdown, no explanation.

The JSON must STRICTLY follow this schema:
{
  "name": "string",
  "description": "string"
}`,
    },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Analyse this image and return a product name and description in JSON format.",
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

  console.log("[AI] Sending request to OpenAI. Model:", process.env.OPENAI_MODEL, "| BaseURL:", process.env.OPENAI_BASE_URL);

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL,
    messages,
  });

  const raw = response.choices[0]?.message?.content;
  console.log("[AI] Raw response from model:", raw);

  if (!raw) {
    throw new Error("Model returned an empty response.");
  }

  // Strip ```json ... ``` or ``` ... ``` wrappers if present
  const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  console.log("[AI] Cleaned response:", cleaned);

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (parseError) {
    console.error("[AI] JSON parse error:", parseError.message, "| Raw cleaned string:", cleaned);
    throw new Error("Failed to parse AI response as JSON.");
  }

  if (!parsed.name || !parsed.description) {
    console.error("[AI] Parsed JSON missing required fields:", parsed);
    throw new Error("AI response is missing 'name' or 'description' fields.");
  }

  return parsed;
}

export async function POST(request) {
  try {
    const { userId } = await getAuth(request);
    const isSeller = await authSeller(userId);

    const body = await request.json();
    const { base64Image, mimeType } = body;

    console.log("[AI Route] Request received. userId:", userId, "| isSeller:", isSeller, "| mimeType:", mimeType, "| hasImage:", !!base64Image);

    if (!base64Image || !mimeType) {
      console.warn("[AI Route] Missing base64Image or mimeType in request body.");
      return NextResponse.json(
        { message: "Base64 image and mime type are required." },
        { status: 400 },
      );
    }

    if (!isSeller) {
      console.warn("[AI Route] Unauthorized request. userId:", userId);
      return NextResponse.json(
        { message: "You are not authorized to perform this action." },
        { status: 401 },
      );
    }

    const result = await main(base64Image, mimeType);
    console.log("[AI Route] Success. Returning:", result);
    return NextResponse.json({ ...result });
  } catch (error) {
    console.error("[AI Route] Unhandled error:", error?.message, error?.stack);
    return NextResponse.json(
      { message: error?.message || "Failed to generate product data from AI." },
      { status: 500 },
    );
  }
}
