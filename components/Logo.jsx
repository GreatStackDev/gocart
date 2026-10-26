import Link from "next/link";
import Image from "next/image";
import logoImg from "@/assets/logo.png";

const Logo = ({ badge, href = "/", className = "", size = "md" }) => {
    // Size variants
    const sizeClasses = {
        sm: {
            container: "gap-2",
            iconBox: "size-8",
            imageSize: 32,
            text: "text-2xl",
            dot: "text-2xl",
        },
        md: {
            container: "gap-2.5",
            iconBox: "size-9 sm:size-10",
            imageSize: 40,
            text: "text-3xl sm:text-4xl",
            dot: "text-3xl sm:text-4xl",
        },
        lg: {
            container: "gap-3",
            iconBox: "size-12",
            imageSize: 48,
            text: "text-4xl sm:text-5xl",
            dot: "text-4xl sm:text-5xl",
        },
    };

    const s = sizeClasses[size] || sizeClasses.md;

    return (
        <Link
            href={href}
            className={`group inline-flex items-center ${s.container} transition-all duration-200 select-none ${className}`}
        >
            {/* Visual Icon Mark */}
            <div
                className={`relative flex items-center justify-center ${s.iconBox} rounded-xl group-hover:scale-95 transition-all duration-200 shrink-0`}
            >
                <Image
                    src={logoImg}
                    alt="e-buy logo"
                    width={s.imageSize}
                    height={s.imageSize}
                    className="w-full h-full object-contain "
                    priority
                />
                {/* Micro accent pulse */}
                {/* <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-600"></span>
                </span> */}
            </div>

            {/* Wordmark + optional Badge */}
            <div className="relative flex items-center">
                <span className={`${s.text} font-extrabold tracking-tight text-slate-800 flex items-center`}>
                    <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
                        e
                    </span>
                    <span className="text-orange-500 font-black mx-0.5">-</span>
                    <span>buy</span>
                    <span className={`text-orange-500 ${s.dot} font-black leading-none`}>.</span>
                </span>

                {badge && (
                    <span className="ml-2 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white bg-gradient-to-r from-orange-600 to-orange-400 rounded-full shadow-xs shadow-orange-500/25 ring-1 ring-orange-400/30">
                        {badge}
                    </span>
                )}
            </div>
        </Link>
    );
};

export default Logo;
