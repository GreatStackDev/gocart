# Architecture Context

## Stack

| Layer | Technology | Role |
| --- | --- | --- |
| **Framework** | Next.js | Full-stack application utilizing the App Router for server/client boundaries.

 |
| **State Management** | Redux Toolkit | Client-side global state management (e.g., cart, products, addresses, and ratings).

 |
| **Auth** | Clerk | User identity management and authentication wrapping.

 |
| **Database** | Prisma | Relational database ORM managing schemas for users, stores, products, orders, and coupons.

 |
| **Background Tasks** | Inngest | Durable execution of background jobs and event-driven workflows.

 |
| **Payments** | Stripe | Payment processing and checkout handling.

 |
| **Asset Storage** | ImageKit | Cloud image CDN and media storage configuration.

 |
| **AI** | OpenAI | AI generation capabilities for store and product features.

 |

## System Boundaries

* `app/(public)` — Public-facing e-commerce storefront encompassing the shop, product details, cart, pricing, and customer orders.


* `app/admin` — Super-admin dashboard for platform management, including store approvals and coupon management.


* `app/store` — Seller dashboard allowing store owners to add/manage products, view orders, and monitor store analytics.


* `app/api` — Authenticated backend request handlers for Stripe webhooks, Inngest events, AI generation, and database mutations.


* `lib/features` — Redux state slices isolating domain logic for address, cart, product, and rating data.


* `inngest` — Centralized definitions for background functions and client configuration.


* `middlewares` — Custom route protection logic separating Admin and Seller access.



## Storage Model

* **Database**: Relational data encompassing users, products, orders, store metadata, and coupons is managed via Prisma.


* **Asset Storage**: Product images and related media are managed externally via ImageKit.


* Prisma schema definitions dictate the structure, relationships, and persistence of all core platform data.



## Auth and Role Model

* User identity is managed externally by Clerk.


* The system enforces a strict multi-tenant role model: Public Users (Buyers), Sellers (Store Owners), and Admins.


* `middlewares/authAdmin.js` ensures only users with admin privileges can access `app/admin` routes or trigger admin API endpoints.


* `middlewares/authSeller.js` ensures only verified store owners can access `app/store` routes or mutate store-specific inventory.



## AI Generation Model

* **Content Generation**: Integrates OpenAI to assist sellers in generating store or product content.


* Execution is handled via dedicated API routes (`app/api/store/ai/route.js`).



## State Management Design

* Global client state is strictly handled by Redux Toolkit.


* The `StoreProvider` wraps the application to provide state access to client components.


* State is modularized into specific slices (`cartSlice`, `productSlice`, `addressSlice`, `ratingSlice`) inside the `lib/features` directory to keep domain logic decoupled.



## Invariants

1. Long-running asynchronous processes must be offloaded to Inngest rather than keeping API requests alive.


2. Role-based access control (RBAC) must be strictly enforced at the middleware layer before requests reach the Admin or Store dashboards.


3. Client-side state mutations (like adding to the cart) must flow through Redux slices.


4. Database interactions must occur exclusively through the Prisma client in secure server contexts or API routes.