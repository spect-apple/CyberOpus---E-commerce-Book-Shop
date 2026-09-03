# CyberOpus Frontend

React 18 + TypeScript + Vite frontend for the CyberOpus online bookstore.

## Prerequisites

- Node.js 18+
- npm or yarn
- Backend running at http://localhost:8080

## Setup

```bash
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

All `/api` requests are proxied to `http://localhost:8080` via Vite's dev server proxy.

## Scripts

```bash
npm run dev      # Start development server
npm run build    # TypeScript check + production build
npm run preview  # Preview production build
npm test         # Run tests (Vitest)
npm run test:watch  # Watch mode
```

## Environment

Create `.env.local` to override defaults:
```
VITE_API_BASE_URL=/api
```

## Pages & Routes

| Route | Page | Access |
|-------|------|--------|
| / | Home | Public |
| /login | Login | Public |
| /register | Register | Public |
| /books | Book Catalogue | Public |
| /books/:id | Book Detail | Public |
| /recommendations | Recommendations | Public |
| /cart | Cart | Auth |
| /addresses | Addresses | Auth |
| /checkout | Checkout | Auth |
| /orders | Orders | Auth |
| /orders/:id | Order Detail | Auth |
| /rewards | Reward Points | Auth |
| /admin | Admin Dashboard | Admin |
| /admin/books | Manage Books | Admin |
| /admin/categories | Manage Categories | Admin |
| /admin/brands | Manage Brands | Admin |

## Test Coverage

- AuthContext: login, logout, register, token persistence
- ProtectedRoute: redirect unauthenticated, render authenticated
- CartContext: add item, item count
- BooksPage: load books, search, filter
- CheckoutPage: form render, FAIL_TEST message

Run: `npm test` — 24 tests pass
