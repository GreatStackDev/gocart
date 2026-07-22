# tradrsAvenue

## Overview

tradrsAvenue is a multi-vendor, two-sided e-commerce marketplace. Sellers can create stores, manage inventory, and fulfill orders, while buyers can browse products, manage their carts, and securely check out. Platform administrators govern the ecosystem by approving stores and managing global promotions.

## Goals

1. Let buyers seamlessly browse products, manage their carts, and check out securely.


2. Let sellers create and manage their own storefronts, product listings, and incoming orders.


3. Provide admins with dedicated tools to govern the platform, approve stores, and manage coupons.


4. Let AI assist sellers in generating store or product content to streamline onboarding.


5. Ensure secure payment processing and durable background task execution.



## Core User Flows

### Buyer Flow

1. User browses the public marketplace (`app/(public)/shop`).


2. User views product details and adds items to their client-side cart.


3. User proceeds to secure checkout via Stripe.


4. User tracks their order history and can leave ratings for products.



### Seller Flow

1. User signs in and applies to create a store (`app/(public)/create-store`).


2. Admin reviews and approves the store application.


3. Seller enters the secure store dashboard (`app/store`).


4. Seller adds products, manages stock levels, and fulfills customer orders.


5. Seller optionally prompts the AI to assist with store or product generation.



### Admin Flow

1. User signs in with administrative privileges.


2. Admin accesses the protected admin dashboard (`app/admin`).


3. Admin reviews pending store applications and toggles store statuses.


4. Admin creates and manages promotional coupons for the marketplace.



## Features

### Authentication and Roles

* User sign-in and identity management powered by Clerk.


* Strict Role-Based Access Control (RBAC) separating Buyers, Sellers, and Admins.


* Dedicated route protection middlewares (`middlewares/authAdmin.js` and `middlewares/authSeller.js`).



### Buyer Experience

* Public storefront with categorical browsing and detailed product pages.


* Robust client-side cart management utilizing Redux Toolkit (`lib/features/cart/cartSlice.js`).


* Secure checkout and payment processing via Stripe (`app/api/stripe/route.js`).


* User order tracking and a product rating system.



### Seller Dashboard

* Protected dashboard for approved store owners (`app/store/layout.jsx`).


* Interface for adding and managing product listings (`app/store/add-product`).


* Order management and inventory stock toggling controls.


* Store analytics and data visualizations (e.g., `OrdersAreaChart`).



### AI Store Assistance

* AI integration to help sellers generate product descriptions and store content.


* Execution runs through dedicated backend routes (`app/api/store/ai/route.js`).



### Admin & Platform Governance

* Super-admin dashboard for overarching platform metrics.


* Interface to approve, reject, or toggle the status of seller stores (`app/admin/approve`).


* Creation and distribution of platform-wide discount coupons (`app/admin/coupons`).


* Durable execution of asynchronous background jobs via Inngest.



## Scope

### In Scope

* Multi-tenant role authentication (Public, Seller, Admin).


* Public marketplace with shopping cart and secure Stripe checkout.


* Seller product, stock, and order management tools.


* Admin store approval workflows and promotional coupon management.


* AI-assisted content generation for sellers.


* Product image and media hosting via ImageKit.


* Global state management using Redux Toolkit.



### Out Of Scope

* Complex warehouse and external shipping logistics integrations.
* Native mobile applications (iOS/Android).
* Highly granular enterprise permission tiers beyond Buyer, Seller, and Admin.

## Success Criteria

1. A buyer can successfully add products to their cart and complete a payment.


2. A user can apply for a store and successfully list products once approved by an admin.


3. An admin can securely access their dashboard to manage stores and coupons.


4. Sellers can leverage the AI integration to generate storefront data.


5. Platform data (relational metadata in Prisma, images in ImageKit) is isolated and stored in the correct architectural layers.