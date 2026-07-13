import { categories } from "@/assets/assets";
import Link from "next/link";

/**
 * tradrsAvenue — Categories Marquee
 * Slow scroll (40s). No gradient overlays (removed).
 * Hover pauses scroll.
 */
const CategoriesMarquee = () => {
    return (
        <div className="overflow-hidden w-full relative max-w-7xl mx-auto select-none group my-8">
            <div className="flex min-w-[200%] animate-marquee group-hover:[animation-play-state:paused] gap-3">
                {[...categories, ...categories, ...categories, ...categories].map((category, index) => (
                    <Link
                        key={index}
                        href={`/shop?category=${encodeURIComponent(category)}`}
                        className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-[8px] text-[#6B7280] text-xs sm:text-sm whitespace-nowrap
                                   hover:border-[#1E1B4B] hover:text-[#1E1B4B] transition-colors duration-150"
                    >
                        {category}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CategoriesMarquee;