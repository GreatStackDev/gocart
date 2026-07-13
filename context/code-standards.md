# Code Standards

## General

* Keep modules small and single-purpose.


* Fix root causes — do not layer workarounds.


* Do not mix unrelated concerns in one component or route.


* Respect the system boundaries defined in the architecture context (e.g., separating Admin, Store/Seller, and Public contexts).



## JavaScript & React

* The project utilizes JavaScript and JSX (`.js`, `.jsx`) rather than TypeScript.


* Use modern ES6+ features, functional components, and standard React hooks.


* Validate unknown external input at system boundaries before trusting it, especially in API routes.



## Next.js

* Default to React Server Components.


* Add `"use client"` only when the component needs browser interactivity, local state hooks, or access to the Redux store.


* Keep route handlers focused on a single responsibility.


* Long-running work belongs in background tasks (via Inngest), not in synchronous API request handlers.



## State Management

* Use Redux Toolkit exclusively for global client-side state management.


* Keep domain logic strictly isolated within its respective slice (e.g., `cartSlice.js`, `productSlice.js`, `addressSlice.js`, `ratingSlice.js`).


* Only wrap components with the Redux `StoreProvider` where state access is explicitly required.



## API Routes & Security

* Validate and parse request input before any business logic executes.


* Enforce role-based access control (RBAC) and authentication checks before any mutation.


* Use the dedicated middleware files (`middlewares/authAdmin.js` and `middlewares/authSeller.js`) to protect sensitive routes.


* Return consistent, predictable JSON response shapes from all `app/api` routes.


* Keep route handlers thin — push heavy background processing (like AI generation) into Inngest workflows.



## Data and Storage

* Core e-commerce data (products, orders, store metadata, coupons, and users) belongs in the database managed via Prisma (`prisma/schema.prisma`).


* Product images and media assets belong in ImageKit (`configs/imageKit.js`).


* Do not store raw or base64 image data directly in the database; store only the ImageKit URL reference.



## File Organization

* `lib/` — Shared infrastructure including the Prisma client, Redux store configuration, and individual feature slices.


* `inngest/` — All durable background tasks, event-driven workflows, and the Inngest client configuration.


* `middlewares/` — Route protection and role validation logic.


* `components/` — UI composition, cleanly separated by domain (`components/admin/`, `components/store/`, and generic public components).


* `app/api/` — Authenticated route handlers, Stripe webhooks, OpenAI integrations, and Inngest event triggers.