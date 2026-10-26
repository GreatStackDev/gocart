import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import StoreProvider from "@/app/StoreProvider";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://e-buy-tola-san.vercel.app'),
    title: {
        default: "e-buy. - Shop smarter",
        template: "%s | e-buy.",
    },
    description: "Discover top-rated tech, smart gadgets, and essential accessories with fast checkout and unbeatable deals.",
    keywords: ["e-commerce", "gadgets", "electronics", "smartphones", "smartwatches", "headphones", "e-buy"],
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "/",
        siteName: "e-buy.",
        title: "e-buy. - Shop smarter. Best Tech Deals.",
        description: "Discover top-rated tech, smart gadgets, and essential accessories with fast checkout and unbeatable deals.",
        images: [
            {
                url: "/opengraph-image.jpg",
                width: 1200,
                height: 630,
                alt: "e-buy - Shop smarter",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "e-buy. - Shop smarter. Best Tech Deals.",
        description: "Discover top-rated tech, smart gadgets, and essential accessories with fast checkout and unbeatable deals.",
        images: ["/twitter-image.jpg"],
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${outfit.className} antialiased`}>
                <StoreProvider>
                    <Toaster />
                    {children}
                </StoreProvider>
            </body>
        </html>
    );
}
