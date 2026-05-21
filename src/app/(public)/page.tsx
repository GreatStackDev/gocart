'use client'
import BestSelling from "@/src/components/BestSelling";
import Hero from "@/src/components/Hero";
import Newsletter from "@/src/components/Newsletter";
import OurSpecs from "@/src/components/OurSpec";
import LatestProducts from "@/src/components/LatestProducts";

export default function Home() {
    return (
        <div>
            <Hero />
            <LatestProducts />
            <BestSelling />
            <OurSpecs />
            <Newsletter />
        </div>
    );
}
