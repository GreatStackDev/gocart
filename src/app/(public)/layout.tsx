'use client'
import Banner from "@/src/components/Banner";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";

export default function PublicLayout({ children }) {

    return (
        <>
            <Banner />
            <Navbar />
            {children}
            <Footer />
        </>
    );
}
