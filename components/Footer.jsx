import Link from "next/link";

// Flat SVG social icons — no animation, just hover color change
const TwitterXIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.261 5.632 5.903-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);
const InstagramIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
);
const FacebookIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
);
const TikTokIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.29 6.29 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.13 8.13 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
    </svg>
);

const Footer = () => {
    const linkSections = [
        {
            title: "Marketplace",
            links: [
                { text: "Browse Products", path: "/shop" },
                { text: "Categories", path: "/shop" },
                { text: "Verified Vendors", path: "/shop?verified=true" },
                { text: "Trending Now", path: "/shop?sort=trending" },
            ],
        },
        {
            title: "Sellers",
            links: [
                { text: "Start Selling", path: "/create-store" },
                { text: "Seller Dashboard", path: "/store" },
                { text: "Get Verified", path: "/store/verification" },
                { text: "Pro Plan", path: "/pricing" },
            ],
        },
        {
            title: "Help",
            links: [
                { text: "How It Works", path: "/" },
                { text: "Buyer Protection", path: "/" },
                { text: "Contact Support", path: "/" },
                { text: "Privacy Policy", path: "/" },
            ],
        },
    ];

    const socialIcons = [
        { icon: TwitterXIcon, href: "https://twitter.com", label: "Twitter / X" },
        { icon: InstagramIcon, href: "https://www.instagram.com", label: "Instagram" },
        { icon: FacebookIcon, href: "https://www.facebook.com", label: "Facebook" },
        { icon: TikTokIcon, href: "https://www.tiktok.com", label: "TikTok" },
    ];

    return (
        <footer className="bg-white border-t border-[#E5E7EB] mt-20">
            <div className="max-w-7xl mx-auto px-6 pt-12 pb-6">

                {/* Top section */}
                <div className="flex flex-col md:flex-row justify-between gap-10 pb-10 border-b border-[#E5E7EB]">

                    {/* Brand column */}
                    <div className="max-w-xs">
                        <Link href="/" className="flex items-center gap-1">
                            <span className="font-[family-name:var(--font-heading)] font-bold text-xl text-[#1E1B4B]">tradrs</span>
                            <span className="font-[family-name:var(--font-heading)] font-bold text-xl text-[#F59E0B]">Avenue</span>
                        </Link>
                        <p className="mt-4 text-sm text-[#6B7280] leading-relaxed">
                            South Africa&apos;s marketplace for local hustlers and everyday buyers. Shop local, support small business, and sell with confidence.
                        </p>

                        {/* Trust line */}
                        <div className="mt-4 flex items-center gap-2 text-xs text-[#10B981] font-medium">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                <polyline points="9 12 11 14 15 10" />
                            </svg>
                            Buyer Protection on Every Order
                        </div>

                        {/* Social icons */}
                        <div className="flex items-center gap-2 mt-5">
                            {socialIcons.map(({ icon: Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="w-9 h-9 flex items-center justify-center rounded-[8px] border border-[#E5E7EB] text-[#6B7280] hover:text-[#1E1B4B] hover:border-[#1E1B4B] transition-colors duration-150"
                                >
                                    <Icon />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    <div className="flex flex-wrap gap-10 text-sm">
                        {linkSections.map((section) => (
                            <div key={section.title}>
                                <h3 className="font-semibold text-[#111827] mb-4 text-xs uppercase tracking-wider">
                                    {section.title}
                                </h3>
                                <ul className="space-y-2.5">
                                    {section.links.map((link) => (
                                        <li key={link.text}>
                                            <Link
                                                href={link.path}
                                                className="text-[#6B7280] hover:text-[#111827] transition-colors duration-150"
                                            >
                                                {link.text}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 text-xs text-[#9CA3AF]">
                    <p>© 2025 tradrsAvenue. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <Link href="/" className="hover:text-[#6B7280] transition-colors duration-150">Terms</Link>
                        <Link href="/" className="hover:text-[#6B7280] transition-colors duration-150">Privacy</Link>
                        <Link href="/" className="hover:text-[#6B7280] transition-colors duration-150">Support</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;