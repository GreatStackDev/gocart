## UI Context — tradrsAvenue

### Design Philosophy

- **Flat color only** — zero gradients anywhere in the UI
- **White space first** — generous padding, breathing room between elements
- **Subtle motion** — hover lift only (`translateY(-2px)` + `box-shadow` step up). No spin, pulse, bounce, or heavy transitions
- **Mobile-first** — layouts designed for 390px, scaled up
- **SA market** — fast, data-light, trustworthy feel

---

### Color Tokens

| Token | Value | Usage |
|---|---|---|
| `--color-primary` | `#1E1B4B` | Buttons, headings, active nav, hero bg |
| `--color-primary-light` | `#312E81` | Hover state for primary elements |
| `--color-accent` | `#F59E0B` | CTA buttons, highlights, badges |
| `--color-accent-light` | `#FEF3C7` | Accent card backgrounds |
| `--color-bg` | `#FAFAF7` | Page background |
| `--color-surface` | `#FFFFFF` | Cards, panels, inputs |
| `--color-text` | `#111827` | Body text |
| `--color-muted` | `#6B7280` | Secondary text, labels |
| `--color-border` | `#E5E7EB` | Dividers, card borders |
| `--color-success` | `#10B981` | Verified badge, in-stock, confirmed |
| `--color-warning` | `#F59E0B` | Pending states |
| `--color-danger` | `#EF4444` | Errors, disputes, out-of-stock |
| `--color-indigo-50` | `#EEF2FF` | Light indigo surface (side banners) |

**NO GRADIENTS.** Do not use `bg-gradient-*`, `gradient-to-*`, or `bg-clip-text` anywhere.

---

### Typography

| Role | Font | Weight | Size |
|---|---|---|---|
| Headings | `Plus Jakarta Sans` | 600–700 | `text-2xl`–`text-5xl` |
| Body | `Inter` | 400–500 | `text-sm`–`text-base` |
| Labels / Caps | `Inter` | 500 | `text-xs` uppercase |
| Monospace | System mono | 400 | `text-sm` |

Loaded via `next/font/google` in `app/layout.jsx`.

---

### Spacing & Layout

- Max content width: `max-w-7xl mx-auto`
- Page side padding: `px-6` (mobile) → `px-10` (desktop)
- Section gap: `my-16` between homepage sections
- Card gap: `gap-5` in grids

---

### Border Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | `8px` | Inputs, small chips |
| `--radius-md` | `12px` | Cards, panels |
| `--radius-lg` | `16px` | Hero banners, large cards |

---

### Shadow System

| Token | Value | Usage |
|---|---|---|
| `--shadow-sm` | `0 1px 3px rgba(0,0,0,0.08)` | Default card |
| `--shadow-md` | `0 4px 12px rgba(0,0,0,0.10)` | Hover state |
| `--shadow-lg` | `0 8px 24px rgba(0,0,0,0.12)` | Modals, dropdowns |

---

### Animation Rules

**Allowed:**
- `transition: transform 0.15s ease, box-shadow 0.15s ease` on cards/buttons
- Hover: `translateY(-2px)` + step up shadow (`shadow-sm` → `shadow-md`)
- Focus: `ring-2 ring-indigo-700 ring-offset-2`

**Forbidden:**
- No `animate-spin`, `animate-pulse`, `animate-bounce`
- No marquee animations (remove CategoriesMarquee or make it static)
- No fade-in-on-scroll animations
- No loading spinners — use `Skeleton.jsx` only

---

### Component Conventions

#### Buttons
Three variants only:
- **Primary**: `bg-[#1E1B4B] text-white` → hover `bg-[#312E81]`
- **Accent**: `bg-[#F59E0B] text-white` → hover `bg-[#D97706]`
- **Outline**: `border border-[#E5E7EB] bg-white text-[#111827]` → hover `bg-[#FAFAF7]`

All buttons: `rounded-[8px] px-5 py-2.5 text-sm font-medium transition-all duration-150 hover:-translate-y-0.5`

#### Cards
White surface, `rounded-[12px]`, `shadow-sm`, `border border-[#E5E7EB]`
Hover: `shadow-md -translate-y-0.5`

#### Badges
Pill shape: `rounded-full px-2.5 py-0.5 text-xs font-medium`
- Verified: `bg-[#D1FAE5] text-[#065F46]`
- Pending: `bg-[#FEF3C7] text-[#92400E]`
- In Stock: `bg-[#D1FAE5] text-[#065F46]`
- Out of Stock: `bg-[#FEE2E2] text-[#991B1B]`
- Free Shipping: `bg-[#FEF3C7] text-[#92400E]`

#### Verified Badge
- Small green checkmark icon + "Verified" text
- `bg-[#D1FAE5] text-[#065F46]` pill
- Only shown when `verificationStatus === "verified"`
- Unverified: show nothing (no negative label)

---

### Homepage Layout — 3 Banners Preserved

The three-banner hero layout is unchanged in structure. Colors and content updated:

**Main Banner (large left):**
- Background: `#1E1B4B` (solid indigo)
- Headline text: `text-white`
- Badge: amber pill (static, no animation)
- CTA button: Accent (amber)

**Side Banner 1:**
- Background: `#FEF3C7` (amber-50)
- Text: `#111827`

**Side Banner 2:**
- Background: `#EEF2FF` (indigo-50)
- Text: `#111827`

---

### Dashboard Layout Conventions

- Sidebar: `bg-white border-r border-[#E5E7EB]` — 240px wide
- Content area: `bg-[#FAFAF7]` with `p-8`
- Stat cards: white surface, `shadow-sm`, KPI number in `text-[#1E1B4B]`
- Chart containers: white card with `p-6`

---

### Navbar

- Background: `bg-white` with `border-b border-[#E5E7EB]`
- Logo: `Plus Jakarta Sans` bold, `text-[#1E1B4B]` wordmark
- "Start Selling" button: Accent variant (amber)
- Sticky at top, no blur/glass effects
