import ImageKit from "imagekit";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const imagekit = new ImageKit({
            publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
            urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
        });

        const authenticationParameters = imagekit.getAuthenticationParameters();
        
        return NextResponse.json(authenticationParameters);
    } catch (error) {
        console.error("ImageKit Auth Error:", error);
        return NextResponse.json({ error: "Failed to authenticate with ImageKit" }, { status: 500 });
    }
}
