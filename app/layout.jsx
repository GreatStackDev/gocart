import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import StoreProvider from "@/app/StoreProvider";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const plusJakarta = Plus_Jakarta_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-heading",
    display: "swap",
});

const inter = Inter({
    subsets: ["latin"],
    weight: ["400", "500", "600"],
    variable: "--font-body",
    display: "swap",
});

export const metadata = {
    metadataBase: new URL("https://tradrsavenue.co.za"),
    title: {
        template: "%s | tradrsAvenue",
        default: "tradrsAvenue — South Africa's Multi-Vendor Marketplace",
    },
    description:
        "Discover thousands of products from verified SA vendors. Shop local, support small business. Secure checkout. Buyer protection guaranteed.",
    openGraph: {
        siteName: "tradrsAvenue",
        locale: "en_ZA",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
    },
};

export default function RootLayout({ children }) {
    return (
        <ClerkProvider>
            <html lang="en" className={`${plusJakarta.variable} ${inter.variable}`}>
                <body className="font-[family-name:var(--font-body)] antialiased bg-[#FAFAF7] text-[#111827]">
                    <StoreProvider>
                        <Toaster
                            position="top-right"
                            toastOptions={{
                                style: {
                                    borderRadius: "8px",
                                    background: "#111827",
                                    color: "#fff",
                                    fontSize: "14px",
                                },
                            }}
                        />
                        {children}
                    </StoreProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
