/**
 * tradrsAvenue — Astryx Design System Configuration
 * 
 * This file configures the Astryx design system for the tradrsAvenue
 * multi-vendor marketplace. It defines the brand token overrides on top
 * of Astryx's default theme, maps to our existing color palette, and
 * sets the StyleX output configuration.
 * 
 * Docs: https://stylexjs.com/docs/
 */

/** @type {import('@stylexjs/stylex').Theme} */
const config = {
  /**
   * Brand identity
   */
  brand: {
    name: "tradrsAvenue",
    locale: "en_ZA",
  },

  /**
   * Design tokens — these map to the CSS variables used throughout the app.
   * The token names are kept intentionally consistent with our existing
   * Tailwind/CSS custom properties so the two systems can coexist.
   */
  tokens: {
    // Primary brand palette
    colorPrimary:       "#1E1B4B",   // Indigo 900 — nav, hero bg, headings
    colorPrimaryLight:  "#EEF2FF",   // Indigo 50  — subtle bg tints
    colorPrimaryDark:   "#0F0D30",   // Deeper indigo for pressed/active states

    // Accent / CTA palette
    colorAccent:        "#F59E0B",   // Amber 400 — CTA buttons, badges
    colorAccentLight:   "#FEF3C7",   // Amber 50  — pill backgrounds
    colorAccentDark:    "#D97706",   // Amber 600 — hover state

    // Neutrals
    colorBg:            "#FAFAF7",   // Off-white page background
    colorSurface:       "#FFFFFF",   // Card / panel surfaces
    colorBorder:        "#E5E7EB",   // Gray 200  — dividers, input borders
    colorTextPrimary:   "#111827",   // Gray 900  — body text
    colorTextSecondary: "#6B7280",   // Gray 500  — muted text
    colorTextMuted:     "#9CA3AF",   // Gray 400  — placeholder, captions

    // Semantic
    colorSuccess:       "#10B981",   // Emerald 500
    colorWarning:       "#F59E0B",   // Amber 400
    colorError:         "#EF4444",   // Red 500

    // Typography scale (font-size)
    textXs:   "11px",
    textSm:   "14px",
    textBase: "16px",
    textLg:   "18px",
    textXl:   "20px",
    text2xl:  "24px",
    text3xl:  "30px",
    text4xl:  "36px",
    text5xl:  "48px",

    // Font families (match next/font variables)
    fontHeading: "var(--font-heading)",  // Plus Jakarta Sans
    fontBody:    "var(--font-body)",     // Inter

    // Spacing scale
    space1:  "4px",
    space2:  "8px",
    space3:  "12px",
    space4:  "16px",
    space5:  "20px",
    space6:  "24px",
    space8:  "32px",
    space10: "40px",
    space12: "48px",
    space16: "64px",

    // Border radii
    radiusSm:  "6px",
    radiusMd:  "8px",
    radiusLg:  "12px",
    radiusXl:  "16px",
    radiusFull: "9999px",

    // Shadows
    shadowSm:  "0 1px 3px rgba(0,0,0,0.08)",
    shadowMd:  "0 4px 12px rgba(0,0,0,0.10)",
    shadowLg:  "0 8px 24px rgba(0,0,0,0.15)",

    // Transitions
    transitionFast:   "100ms ease",
    transitionNormal: "150ms ease",
    transitionSlow:   "300ms ease",
  },
};

module.exports = config;
