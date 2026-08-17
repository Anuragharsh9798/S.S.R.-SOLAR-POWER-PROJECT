# SSR SOLAR POWER - Production NestJS Backend Documentation

---

## 1. 📁 Backend Folder Structure

```text
backend/
├── prisma/
│   ├── migrations/
│   │   └── 0_init/
│   │       └── migration.sql       # Initial SQL DDL migration for 14 tables
│   └── schema.prisma              # Prisma schema definition (14 PostgreSQL models)
├── src/
│   ├── admin/
│   │   └── admin.controller.ts     # Protected Admin dashboard routes
│   ├── audit-log/
│   │   ├── audit-log.controller.ts # Admin Audit Logs endpoint
│   │   ├── audit-log.module.ts     # Global AuditLog module
│   │   └── audit-log.service.ts    # Audit logging service with credential stripping
│   ├── auth/
│   │   ├── decorators/
│   │   │   └── roles.decorator.ts  # @Roles(...) decorator for RBAC
│   │   ├── dto/
│   │   │   └── login.dto.ts        # Login request validation DTO
│   │   ├── enums/
│   │   │   └── role.enum.ts       # SUPER_ADMIN, ADMIN, CONTENT_MANAGER, STAFF
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts  # JWT Authentication guard
│   │   │   └── roles.guard.ts     # Backend RBAC Authorization guard
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts    # Passport JWT strategy (Cookies & Bearer headers)
│   │   ├── argon2.service.ts      # Argon2id password hashing service
│   │   ├── auth.controller.ts    # Login, Logout, Me endpoints
│   │   ├── auth.module.ts        # Authentication module
│   │   └── auth.service.ts        # User validation & session management
│   ├── blogs/
│   │   ├── dto/
│   │   │   ├── create-blog.dto.ts
│   │   │   └── update-blog.dto.ts
│   │   ├── admin-blogs.controller.ts
│   │   ├── blogs.controller.ts
│   │   ├── blogs.module.ts
│   │   └── blogs.service.ts
│   ├── calculator/
│   │   ├── dto/
│   │   │   └── calculate-solar.dto.ts # Solar input validation
│   │   ├── calculator.controller.ts  # POST /api/v1/calculator/calculate
│   │   ├── calculator.module.ts
│   │   └── calculator.service.ts     # 530W Panel math & PM Surya Ghar subsidy engine
│   ├── chat/
│   │   ├── dto/
│   │   │   └── send-chat-message.dto.ts
│   │   ├── chat.controller.ts       # POST /api/v1/chat
│   │   ├── chat.module.ts
│   │   └── chat.service.ts          # AI Assistant, prompt injection filter & output sanitizer
│   ├── common/
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts # Global Exception Filter (Stack trace mask)
│   │   └── interceptors/
│   │       └── sanitize-response.interceptor.ts # Sensitive key response scrubber
│   ├── config/
│   │   └── env.validation.ts        # Joi schema for boot environment validation
│   ├── contact/
│   │   ├── dto/
│   │   │   └── create-contact.dto.ts
│   │   ├── contact.controller.ts    # POST /api/v1/contact
│   │   ├── contact.module.ts
│   │   └── contact.service.ts
│   ├── government-statistics/
│   │   ├── dto/
│   │   │   └── create-govt-stat.dto.ts
│   │   ├── government-statistics.controller.ts
│   │   ├── government-statistics.module.ts
│   │   └── government-statistics.service.ts # Official MNRE & UPNEDA statistics
│   ├── projects/
│   │   ├── dto/
│   │   │   ├── create-project.dto.ts
│   │   │   └── update-project.dto.ts
│   │   ├── admin-projects.controller.ts
│   │   ├── projects.controller.ts
│   │   ├── projects.module.ts
│   │   └── projects.service.ts
│   ├── quotation/
│   │   ├── dto/
│   │   │   └── create-quotation.dto.ts # Lead submission (Validates Lat/Lon -90..90, -180..180)
│   │   ├── quotation.controller.ts     # POST & GET /api/v1/quotations
│   │   ├── quotation.module.ts
│   │   └── quotation.service.ts        # Lead generation & quote reference generator
│   ├── reviews/
│   │   ├── dto/
│   │   │   └── create-review.dto.ts
│   │   ├── reviews.controller.ts       # Public submission & Admin approval
│   │   ├── reviews.module.ts
│   │   └── reviews.service.ts
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts           # Prisma 7 driver adapter (@prisma/adapter-pg)
│   ├── app.controller.ts               # GET /health
│   ├── app.module.ts                   # Central NestJS root module
│   ├── app.service.ts
│   └── main.ts                         # Application entrypoint (Helmet, CORS, Validation)
├── test/                               # E2E Test Suite (7 Test Suites, 23 Tests)
│   ├── app.e2e-spec.ts
│   ├── auth.e2e-spec.ts
│   ├── calculator.e2e-spec.ts
│   ├── content.e2e-spec.ts
│   ├── quotation.e2e-spec.ts
│   ├── security.e2e-spec.ts
│   └── system.e2e-spec.ts
├── .dockerignore
├── .env.example                        # Security placeholder template
├── .gitignore
├── Dockerfile                          # Multi-stage production container setup (USER node)
├── nest-cli.json
├── package.json
├── prisma.config.ts                    # Prisma 7 configuration file
├── tsconfig.json
└── README.md
```

---

## 2. 🌐 Complete API Endpoint Reference

### Public APIs (Protected by Rate Limiter & Server-side Validation)
| Method | Endpoint | Description | Rate Limit |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Server health check endpoint | Global |
| `POST` | `/api/v1/calculator/calculate` | Solar Sizing & Financial ROI Engine (530W panels) | 60 req/min |
| `POST` | `/api/v1/quotations` | Lead submission with GPS location data & Range Validation | 10 req/min |
| `GET` | `/api/v1/projects` | Public portfolio list | 60 req/min |
| `GET` | `/api/v1/projects/:id` | Public project details | 60 req/min |
| `POST` | `/api/v1/reviews` | Submit review (Requires Admin Approval before display) | 5 req/min |
| `GET` | `/api/v1/reviews` | Fetch approved public customer reviews | 60 req/min |
| `GET` | `/api/v1/blogs` | Fetch published solar guides & blogs | 60 req/min |
| `GET` | `/api/v1/blogs/:slug` | Fetch blog article by slug | 60 req/min |
| `POST` | `/api/v1/contact` | Submit contact form query | 5 req/min |
| `GET` | `/api/v1/government-statistics` | Fetch official MNRE / UPNEDA metrics | 60 req/min |
| `POST` | `/api/v1/chat` | AI Chatbot assistant with prompt injection defense | 10 req/min |

### Authentication APIs
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Argon2id login, sets HttpOnly `access_token` cookie | Public (5 req/min) |
| `POST` | `/api/v1/auth/logout` | Clears `access_token` cookie | Authenticated |
| `GET` | `/api/v1/auth/me` | Fetch authenticated admin user profile | `JwtAuthGuard` |

### Protected Admin APIs (Enforced by Backend RBAC Guards)
| Method | Endpoint | Required Role(s) | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/admin/dashboard` | `SUPER_ADMIN`, `ADMIN` | Dashboard metrics |
| `GET` | `/api/v1/quotations` | `SUPER_ADMIN`, `ADMIN`, `STAFF` | Fetch all customer lead quotes |
| `POST` | `/api/v1/admin/projects` | `SUPER_ADMIN`, `ADMIN`, `CONTENT_MANAGER` | Create portfolio project |
| `PATCH` | `/api/v1/admin/projects/:id` | `SUPER_ADMIN`, `ADMIN`, `CONTENT_MANAGER` | Update portfolio project |
| `DELETE` | `/api/v1/admin/projects/:id` | `SUPER_ADMIN`, `ADMIN`, `CONTENT_MANAGER` | Delete portfolio project |
| `PATCH` | `/api/v1/admin/reviews/:id/approve` | `SUPER_ADMIN`, `ADMIN`, `CONTENT_MANAGER` | Approve/reject customer review |
| `POST` | `/api/v1/admin/blogs` | `SUPER_ADMIN`, `ADMIN`, `CONTENT_MANAGER` | Create blog article |
| `PATCH` | `/api/v1/admin/blogs/:id` | `SUPER_ADMIN`, `ADMIN`, `CONTENT_MANAGER` | Update blog article |
| `DELETE` | `/api/v1/admin/blogs/:id` | `SUPER_ADMIN`, `ADMIN`, `CONTENT_MANAGER` | Delete blog article |
| `POST` | `/api/v1/admin/government-statistics` | `SUPER_ADMIN`, `ADMIN`, `CONTENT_MANAGER` | Create government metric |
| `PATCH` | `/api/v1/admin/government-statistics/:id` | `SUPER_ADMIN`, `ADMIN`, `CONTENT_MANAGER` | Update government metric |
| `DELETE` | `/api/v1/admin/government-statistics/:id` | `SUPER_ADMIN`, `ADMIN`, `CONTENT_MANAGER` | Delete government metric |
| `GET` | `/api/v1/admin/audit-logs` | `SUPER_ADMIN`, `ADMIN` | Retrieve audit log history |

---

## 3. 🗄️ Database Tables (14 Prisma Models)

1. `roles`: Core RBAC roles (`SUPER_ADMIN`, `ADMIN`, `CONTENT_MANAGER`, `STAFF`).
2. `users`: Admin and staff user credentials (Argon2id password hashes).
3. `customers`: Customer profiles & contact info.
4. `quotations`: Lead quote requests with location metadata & solar sizing calculations.
5. `contact_messages`: Inbound contact form queries.
6. `projects`: Completed solar rooftop installations.
7. `project_images`: Gallery images associated with projects.
8. `reviews`: Customer testimonials (moderated via `isApproved`).
9. `blog_categories`: Blog category taxonomy.
10. `blogs`: Articles, guides, and news.
11. `government_statistics`: MNRE / UPNEDA official metrics.
12. `chat_conversations`: AI assistant session metadata.
13. `chat_messages`: User and AI message history.
14. `audit_logs`: Administrative event logs (no plain-text passwords or keys).

---

## 4. 🔑 Environment Variables Configuration

Create `backend/.env` based on `backend/.env.example`:

```env
PORT=3000
NODE_ENV=development
APP_NAME="SSR Solar Power Backend"
CORS_ORIGIN="http://localhost:8080"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ssr_solar_db?schema=public"
JWT_SECRET=REPLACE_WITH_64_BYTE_RANDOM_SECRET
JWT_EXPIRES_IN="1d"
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

---

## 5. 💻 How to Run Locally

### Prerequisites
* Node.js v20+
* PostgreSQL server running locally or via Docker

### Steps
1. Navigate to backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Generate Prisma client:
   ```bash
   npx prisma generate
   ```
4. Run Prisma database migrations:
   ```bash
   npx prisma migrate dev --name init
   ```
5. Start development server:
   ```bash
   npm run dev
   ```
6. Run unit and E2E security tests:
   ```bash
   npm test
   npm run test:e2e
   ```

---

## 6. 🐳 How to Run with Docker

### Build Docker Image
```bash
cd backend
docker build -t ssr-solar-backend .
```

### Run Docker Container
```bash
docker run -d \
  --name ssr-solar-backend-container \
  -p 3000:3000 \
  --env-file .env \
  ssr-solar-backend
```

### Verify Container Health
```bash
curl http://localhost:3000/health
```

---

## 7. 🛡️ Security Verification Checklist

- [x] **SQL Injection**: Prevented via Prisma ORM parameterized queries.
- [x] **XSS Defense**: Content sanitization, Helmet headers (`X-XSS-Protection`, CSP).
- [x] **Argon2id Hashing**: Passwords stored exclusively as Argon2id hashes (64MB memory, 3 iterations).
- [x] **HttpOnly Cookies**: JWT access tokens stored in `HttpOnly`, `SameSite=Strict`, `Secure` cookies.
- [x] **Backend-Enforced RBAC**: Authorization checked strictly on backend via `RolesGuard` and `@Roles(...)`.
- [x] **Rate Limiting**: Protected against brute-force and DoS using `@nestjs/throttler`.
- [x] **Mass Assignment Defense**: `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })` rejects unexpected parameters.
- [x] **Latitude/Longitude Range Validation**: Enforces `@Min(-90)` / `@Max(90)` for latitude and `@Min(-180)` / `@Max(180)` for longitude.
- [x] **Location Privacy**: GPS coordinates are restricted to authenticated quotes/admin endpoints and never leaked on public APIs.
- [x] **Response Data Sanitization**: `SanitizeResponseInterceptor` strips sensitive keys before JSON output.
- [x] **Chatbot Prompt Injection Defense**: Input scanner rejects jailbreak phrases; output filter scrubs credentials.
- [x] **Audit Trail Integrity**: Administrative actions recorded without plain-text passwords or keys.

---

## 8. ⚠️ Additional Production Configurations Required

1. **Production Database Connection**: Set real PostgreSQL connection string in `DATABASE_URL` (e.g. Supabase, AWS RDS, or managed PostgreSQL).
2. **Production JWT Secret**: Generate a 64-byte random secret (`openssl rand -hex 64` or `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`).
3. **CORS Allowlist**: Set `CORS_ORIGIN` to production domain (e.g. `https://ssrsolarpower.com`).
4. **SSL / TLS Termination**: Configure reverse proxy (Nginx / Cloudflare) to enforce HTTPS for Secure cookies.

---

> [!WARNING]
> **Security Disclaimer**: While this backend incorporates industry best-practice security controls (Argon2id, Helmet, CORS, Rate Limiting, Sanitization, and RBAC), no software application can be claimed as 100% unhackable. Continuous monitoring, dependency updates, database backups, and environment auditing are essential for long-term production security.
