# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- **Phase 2 — Schema & Backend Expansion** (NEXT)

## Current Goal

- Extend Prisma schema: escrow fields on Order, Conversation + Message models, VerificationRequest model, SocialShareLink model, Store additions (verificationStatus, faqItems, plan, categories, etc.)
- Add new API routes for PayFast, delivery confirmation, messaging, verification, social share.
- Remove Stripe references, add PayFast checkout + ITN webhook.

## Completed

- ✅ Master implementation plan approved (v2)
- ✅ context/ui-context.md created with full design token system
- ✅ context/project-overview.md will be updated
- ✅ app/globals.css rebuilt with CSS custom properties

## In Progress

- Rebuilding core components: Navbar, Footer, Hero, ProductCard
- Creating `components/ui/` primitive library

## Next Up

- Phase 2: Schema & Backend Expansion (Prisma migrations, new models)
- Phase 3: Seller onboarding wizard + verification

## Open Questions

- None — all resolved in implementation plan v2.

## Architecture Decisions

- **No Stripe** — PayFast only (Stripe unavailable in SA)
- **No gradients** — flat `#1E1B4B` indigo + `#F59E0B` amber color system
- **In-app chat** — Inngest + 10s polling, post-purchase only, free
- **FAQ widget** — seller-written Q&A, code-driven, no LLM
- **Escrow** — in-database status flag system, button + 7-day auto-release
- **Verification** — SA ID photo only, no business docs required

## Session Notes

- Phase 1 begun 2026-07-14
- Dev server running at localhost:3000 via `npm run dev --turbopack`
