# CyberOpus — Online Bookstore

A full-stack online bookstore application built as a capstone project.

## Architecture

```
CyberOpus/
├── backend/   Spring Boot 3.4.5 + Java 21 target (JDK 26 compatible)
└── frontend/  React 18 + TypeScript + Vite
```

**Backend**: REST API → Spring Security (JWT) → Service Layer → Spring Data JPA → PostgreSQL/H2

**Frontend**: React Router → Axios (with JWT interceptor) → Spring Boot API (proxied via Vite)

## Technologies

| Layer | Technology |
|-------|-----------|
| Backend | Spring Boot 3.4.5, Java 21 (compiled), JDK 26 runtime |
| Database | PostgreSQL (production), H2 (tests) |
| ORM | Spring Data JPA + Hibernate + Flyway |
| Security | Spring Security + JWT (jjwt 0.12.x) + BCrypt |
| API Docs | SpringDoc OpenAPI / Swagger UI |
| Frontend | React 18, TypeScript, Vite, React Router v6, Axios |
| Testing | JUnit 5, Mockito, Spring Boot Test, Vitest, React Testing Library |

## Quick Start

### 1. Environment Variables

```bash
cd backend
cp .env.example .env
# Edit .env with your Neon PostgreSQL connection details
```

### 2. Backend

```bash
cd backend
# With .env loaded (default uses H2 in-memory):
./mvnw.cmd spring-boot:run

# With PostgreSQL (Neon):
./mvnw.cmd spring-boot:run -Dspring.profiles.active=prod
```

Backend runs at: http://localhost:8080
Swagger UI: http://localhost:8080/swagger-ui.html

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:5173 (proxies `/api` to backend :8080)

## Demo Credentials

| User | Email | Password | Role |
|------|-------|----------|------|
| Alice | alice@demo.com | Password123! | CUSTOMER |
| Bob | bob@demo.com | Password123! | CUSTOMER |
| Admin | admin@cyberopus.com | Admin123! | ADMIN |

## Test Payment

The application uses a simulated payment system:
- **Normal payment**: Any card holder name → `SUCCESS`, order `CONFIRMED`
- **Test failure**: Card holder name = `FAIL_TEST` → `FAILED`, order stays `PENDING`, cart preserved

Card numbers are never stored. Only the last 4 digits are retained as masked display.

## Reward Points Rules

- **Earn**: 10 points per $1 spent (after successful checkout)
- **Redeem**: 100 points = $1 discount
- **Cap**: Maximum 20% of order subtotal can be discounted via points
- **Cancellation**: Earned points reversed, redeemed points refunded

## Neon PostgreSQL Setup

1. Create a free account at [neon.tech](https://neon.tech)
2. Create a new project and database
3. Copy the connection string to your `.env`:
   ```
   DB_URL=jdbc:postgresql://ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```
4. Flyway will automatically create all tables and seed data on first run

## API Overview

| Module | Endpoints |
|--------|-----------|
| Auth | POST /api/auth/register, /login, GET /me |
| Books | GET /api/books (paginated, filtered), GET /{id}, /search, /{id}/related |
| Categories | GET /api/categories, /{id}, /{id}/books |
| Brands | GET /api/brands, /{id}, /{id}/books |
| Cart | GET/POST/PUT/DELETE /api/cart |
| Addresses | GET/POST/PUT/DELETE/PATCH /api/addresses |
| Checkout | POST /api/checkout |
| Orders | GET /api/orders, /{id}, POST /{id}/cancel, /{id}/buy-again |
| Payments | GET /api/payments/order/{orderId} |
| Rewards | GET /api/rewards |
| Recommendations | GET /api/recommendations |
| Admin Books | POST/PUT/DELETE /api/books |
| Admin Categories | POST/PUT/DELETE /api/categories |
| Admin Brands | POST/PUT/DELETE /api/brands |

## Running Tests

```bash
# Backend (32 tests)
cd backend
./mvnw.cmd clean verify

# Frontend (24 tests)
cd frontend
npm test
```

## Troubleshooting

**Java version**: The backend requires JDK 21+ (tested with JDK 26). Set `JAVA_HOME` appropriately.

**Maven wrapper**: Uses Maven 3.9.9. If download fails, install Maven locally and use `mvn` instead.

**H2 default**: Without setting `DB_URL`, the app runs with H2 in-memory — perfect for development.

**CORS**: Default allows `http://localhost:5173`. Change with `CORS_ORIGINS` env var.
