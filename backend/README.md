# CyberOpus Backend

Spring Boot 3.4.5 REST API for the CyberOpus online bookstore.

## Prerequisites

- JDK 25+
- Maven (or use the included wrapper `./mvnw.cmd`)
- PostgreSQL (or use the default H2 in-memory for development)

## Setup

### 1. Environment Variables

```bash
cp .env.example .env
# Edit .env with your values
```

Required for PostgreSQL:
```
DB_URL=jdbc:postgresql://your-host/cyberopus?sslmode=require
DB_USERNAME=your_username
DB_PASSWORD=your_password
JWT_SECRET=your-256-bit-secret-here
```

### 2. Run

```bash
# Default (H2 in-memory, no PostgreSQL needed)
export JAVA_HOME=/path/to/jdk
./mvnw.cmd spring-boot:run

# With PostgreSQL
./mvnw.cmd spring-boot:run -Dspring.profiles.active=prod
```

### 3. Test

```bash
./mvnw.cmd clean verify
# Expected: 32 tests, BUILD SUCCESS
```

## Neon PostgreSQL Setup

1. Sign up at [neon.tech](https://neon.tech) (free tier available)
2. Create a new project
3. Get the connection string from the Neon dashboard
4. Set in `.env`:
   ```
   DB_URL=jdbc:postgresql://ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   DB_USERNAME=neondb_owner
   DB_PASSWORD=your-neon-password
   ```
5. Run with `-Dspring.profiles.active=prod`

Flyway will automatically create tables (V1) and seed data (V2) on first run.

## API Documentation

Swagger UI: http://localhost:8080/swagger-ui.html
OpenAPI JSON: http://localhost:8080/v3/api-docs
OpenAPI YAML: See `openapi.yaml` in this directory

## Demo Credentials

| Account | Email | Password |
|---------|-------|----------|
| Customer | alice@demo.com | Password123! |
| Customer | bob@demo.com | Password123! |
| Admin | admin@cyberopus.com | Admin123! |

## Project Structure

```
src/main/java/com/cyberopus/
├── config/          SecurityConfig, OpenApiConfig, AppProperties, DataInitializer, CorsConfig
├── controller/      REST controllers (Auth, Book, Cart, Checkout, Order, etc.)
├── dto/
│   ├── request/     Request DTOs with validation
│   └── response/    Response DTOs
├── entity/          JPA entities
├── enums/           Role, OrderStatus, PaymentStatus, TransactionType
├── exception/       GlobalExceptionHandler, custom exceptions
├── repository/      Spring Data JPA repositories
├── security/        JwtUtil, JwtAuthenticationFilter, UserDetailsServiceImpl
└── service/         Business logic services

src/main/resources/
├── application.properties
├── application-prod.properties    (PostgreSQL settings)
├── application-test.properties    (H2 test settings)
└── db/migration/
    ├── V1__create_schema.sql
    └── V2__seed_data.sql
```
