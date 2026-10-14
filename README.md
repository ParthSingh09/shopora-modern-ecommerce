# SHOPORA® — High-End Sneakers & Street Culture E-Commerce Store

> A modern, end-to-end e-commerce web application engineered with **React 19**, **TypeScript**, **Tailwind CSS**, and **Zustand**. Designed as a portfolio-grade project for frontend developer CVs.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-brightgreen?style=for-the-badge&logo=github)](https://parthsingh09.github.io/shopora-modern-ecommerce/)
[![Repository](https://img.shields.io/badge/Repository-ParthSingh09-blue?style=for-the-badge&logo=github)](https://github.com/ParthSingh09/shopora-modern-ecommerce)
[![Deploy with Vercel](https://img.shields.io/badge/Deploy%20with-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/new/clone?repository-url=https://github.com/ParthSingh09/shopora-modern-ecommerce)

🔗 **Live Production URL**: [https://parthsingh09.github.io/shopora-modern-ecommerce/](https://parthsingh09.github.io/shopora-modern-ecommerce/)

---

## ⚡ Live Features

### 1. Product Listing & Catalog (`/` and `/shop`)
- **Responsive Grid**: Fluid responsive layout across mobile, tablet, and desktop viewports.
- **Dynamic Search & Filtering**: Multi-condition live search (by model, brand, SKU, colorway) coupled with categories (*Retro Highs, Collabs & Drops, Low Runners, Designer Street, Skate*).
- **Brand & In-Stock Filters**: Instant toggling between brand selections and "In Stock Only" filters.
- **Sorting Engine**: Sort by Featured / Grails, Price (Low to High & High to Low), Customer Rating, and Release Year.
- **Product Cards**: High-definition imagery with hover angle transitions, authenticity badges (*Grail, Vault Release, Sale*), star ratings, and instant Quick Size Add.

### 2. Product Details (`/product/:id`)
- **Interactive Multi-Angle Gallery**: Thumbnail carousel with high-res zoom preview.
- **Size & Inventory Matrix**: Real-time stock counts per size with disabled/strike-through indicators for sold-out pairs.
- **International Sizing Guide Modal**: US Men's, US Women's, UK, EU, and CM measurement tables with collector fit tips.
- **Quantity Selector**: Enforces upper limit based on live available stock.
- **Collector Reviews & Feedback**: Star rating distributions, verified purchaser badges, and interactive in-hand review submission form.
- **Related Drops**: Category-linked recommendation grid.

### 3. Shopping Bag & Persistence (`/cart` & Slide-Over Drawer)
- **Slide-Over Bag Drawer**: Access bag contents anywhere from the header without page reloads.
- **Dedicated Full Bag View**: Itemized table with quantity increments, decrements, and removal.
- **Automatic Calculations**: Dynamic subtotal, promotional discounts, estimated tax (8%), and free shipping progress meter.
- **Promo Coupon System**: Validates codes like `STREET20` (20% off), `GRAIL50` ($50 off orders over $400), and `FREESHIP` (free shipping) with minimum threshold checks. Coupons are removed automatically if the bag drops below their minimum.
- **Persistent LocalStorage**: Powered by Zustand `persist` middleware—your bag survives page reloads, browser restarts, and tab closures.

### 4. Checkout & Order Processing (`/checkout`)
- **Shipping Address Form Validation**: Real-time field validation for legal name, email format, 10-digit phone number, address, state, and 5-digit ZIP code.
- **Courier Shipping Speeds**: Standard Armored Courier (3-5 days) vs. Priority Vault Flight Overnight (1-2 days).
- **Payment Method Simulation**: Credit card formatting (auto-spaced 16 digits, MM/YY expiry, CVV) or One-Click biometric Apple Pay.
- **Multi-Stage Processing Animation**: Realistic simulated stages (*"Authenticating encrypted gateway" -> "Securing deadstock reservation" -> "Minting cryptographic NFC tag"*).

### 5. Order Confirmation & Authenticity Certificate (`/order-success`)
- **Celebratory Confetti Burst**: Triggered via `canvas-confetti`.
- **Unique Order & Registry IDs**: Generated tracking and cryptographic verification serial numbers.
- **4-Stage Dispatch Timeline**: Real-time visual progress from order confirmation to armored transit.
- **Printable Physical Receipt**: Clean print-optimized stylesheet for paper or PDF export.

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| **React 19 + TypeScript** | Component architecture, state synchronization, and strict type safety |
| **Tailwind CSS v3.4** | Custom street-culture dark mode design system, volt accents, and fluid animations |
| **Zustand** | Global cart store with `localStorage` persistence and computed getters |
| **React Router v7** | Client-side page navigation and URL search query parameter synchronization |
| **Lucide React** | Feather-weight SVG icon library |
| **Canvas Confetti** | Order completion celebratory particle effects |
| **Vitest + Testing Library** | Unit and integration testing for cart calculations, stock rules, and UI components |

---

## 🧪 Testing Suite

Run the full automated test suite:

```bash
npm test
```

Tests cover:
- Cart quantity increments, decrements, and out-of-stock size rejections
- Discount coupon math and free shipping thresholds
- API filtering, keyword search, and minimum order rules
- ProductCard component rendering, ratings, and sold-out button disablement
- Coupon eligibility when the bag changes, and the FREESHIP shipping waiver
- QuickViewModal opening, closing, and switching products

---

## 🚀 Getting Started Locally

Requires **Node.js 20.19+ or 22.12+** (see `.nvmrc`; run `nvm use` if you use nvm).

```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev

# Run test suite
npm test

# Lint
npm run lint

# Build production bundle
npm run build
```
