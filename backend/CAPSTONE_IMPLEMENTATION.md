# CyberOpus — Capstone Implementation Notes

## Implementation Overview

This document describes the key design decisions and implementation details for the CyberOpus capstone project.

## Architecture

```
Controller → Service → Repository → Database
```

All controllers use DTOs (Data Transfer Objects) — entities are never exposed directly. This prevents leaking sensitive fields and allows the API contract to evolve independently of the database schema.

## Security Design

### JWT Authentication
- Tokens are issued on login/register and expire after 24 hours (configurable)
- The `JwtAuthenticationFilter` validates each request before it reaches controllers
- `@AuthenticationPrincipal` injects the authenticated user's details into controller methods
- Unauthorized requests receive `401 Unauthorized`; insufficient permissions receive `403 Forbidden`

### Role-Based Authorization
- `CUSTOMER`: Can only access their own resources (cart, orders, addresses, rewards)
- `ADMIN`: Can manage books, categories, and brands

### Password Security
- BCrypt hashing with salt factor 10
- Passwords are never returned in API responses (`@JsonIgnore`)
- Demo users are created by `DataInitializer` using `BCryptPasswordEncoder.encode()` at runtime

## Key Business Rules

### Checkout (CheckoutService)
The checkout process is fully transactional:
1. Validate cart is non-empty
2. Validate address belongs to authenticated user
3. Calculate totals server-side (never trust client prices)
4. Validate and apply reward points (enforce 20% cap server-side)
5. Check stock with optimistic locking — `@Lock(OPTIMISTIC)` prevents overselling
6. Create Order with address snapshot (preserves historical accuracy)
7. Create OrderItems with price snapshot (preserves historical pricing)
8. Simulate payment:
   - `cardHolderName == "FAIL_TEST"` → FAILED, cart preserved, stock restored
   - Otherwise → SUCCESS, order CONFIRMED, rewards earned, cart cleared

### Order Cancellation (OrderService)
Server-side enforcement:
- Only `PENDING` or `CONFIRMED` orders
- Only within 48 hours of placement (checked against `placedAt` server-side)
- Stock restored atomically
- Reward points reversed (REVERSED_EARN / REVERSED_REDEEM transactions)
- Payment marked REFUNDED

### Reward Points
- Earn rate: 10 points per $1 (configurable via `REWARDS_EARN_RATE`)
- Redeem rate: 100 points = $1 (configurable via `REWARDS_REDEEM_RATE`)
- Max redemption: 20% of subtotal (configurable via `REWARDS_MAX_REDEEM_PCT`)
- Full audit trail in `reward_point_transactions` table

## Database Design

### Key Decisions
- `order_items.unit_price` and `book_title`/`book_author` are snapshots — book price/data changes don't affect old orders
- `orders` stores address snapshot fields — address changes don't affect old orders
- `BIGINT GENERATED ALWAYS AS IDENTITY` for all primary keys (H2-compatible)
- Flyway migrations are idempotent using `WHERE NOT EXISTS` guards
- Foreign keys and indexes on all join columns

### Tables
| Table | Purpose |
|-------|---------|
| users | Customer and admin accounts |
| books | Product catalog |
| categories | Book categories |
| brands | Publishers |
| carts | One cart per user |
| cart_items | Items in cart with price-at-add |
| addresses | Delivery addresses (one default per user) |
| orders | Placed orders with address snapshot |
| order_items | Line items with price/title snapshot |
| payments | Test payment records |
| reward_points | Points balance per user |
| reward_point_transactions | Full audit trail |

## Test Coverage

| Test Class | What's Covered |
|-----------|---------------|
| AuthControllerTest | Register, login, JWT, auth/me, duplicate email, bad credentials |
| BookControllerTest | Pagination, search, filter, admin CRUD, authorization |
| CartControllerTest | Get cart, add, update, remove items, auth required |
| CheckoutServiceTest | Success, FAIL_TEST, insufficient stock, reward points |
| OrderControllerTest | Get orders, cancel (within/after 48h), buy again |
| RewardControllerTest | Get rewards, transaction history |

All 32 tests pass with H2 in-memory database.

## API Count: 37 Endpoints

- Auth: 3
- Books: 7 (3 public, 4 admin)
- Categories: 6 (3 public, 3 admin)
- Brands: 6 (3 public, 3 admin)
- Cart: 5
- Addresses: 5
- Checkout: 1
- Orders: 4
- Payments: 1
- Rewards: 1
- Recommendations: 1

## Configuration Reference

All sensitive values are environment variables:

| Variable | Default | Purpose |
|----------|---------|---------|
| `DB_URL` | H2 in-memory | Database JDBC URL |
| `DB_USERNAME` | sa | Database username |
| `DB_PASSWORD` | (empty) | Database password |
| `JWT_SECRET` | dev-secret | JWT signing key (must be 256-bit for production) |
| `JWT_EXPIRATION_MS` | 86400000 | Token lifetime (24h) |
| `SERVER_PORT` | 8080 | HTTP port |
| `CORS_ORIGINS` | localhost:5173 | Allowed frontend origins |
| `DELIVERY_CHARGE` | 4.99 | Flat delivery fee |
| `DELIVERY_BUSINESS_DAYS` | 5 | Estimated delivery window |
| `REWARDS_EARN_RATE` | 10 | Points per $1 |
| `REWARDS_REDEEM_RATE` | 100 | Points per $1 discount |
| `REWARDS_MAX_REDEEM_PCT` | 20 | Max % of subtotal redeemable |
