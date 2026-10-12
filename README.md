# ACME Employee Salary Management System

[![CI Tests](https://img.shields.io/badge/tests-70%20passing-brightgreen.svg)](#running-tests)
[![Node Version](https://img.shields.io/badge/node-v20-blue.svg)](https://nodejs.org/)
[![TypeScript Strict](https://img.shields.io/badge/typescript-strict%20mode-blue.svg)](https://www.typescriptlang.org/)
[![Database](https://img.shields.io/badge/PostgreSQL-Neon-blue.svg)](https://neon.tech/)

A web-based compensation management and real-time statistical analytics platform built for the **HR Manager** persona of **ACME org**, administering **10,000 employees across multiple global countries**.

Built following software craftsmanship principles, strict **Test-Driven Development (TDD)**, zero tolerance for `any`, and staged AI collaboration.

---

## 🔗 Repository

- **Repository**: [https://github.com/parth-r-parmar/Salary-Management-Assessment](https://github.com/parth-r-parmar/Salary-Management-Assessment)

---

## 🏛️ Architecture & Tech Stack

```mermaid
graph TD
    subgraph Browser ["Client (Browser)"]
        UI["React 18 + Vite SPA"]
        Grid["MUI X DataGrid (Server-side Pagination)"]
        Charts["Analytics Dashboard (MUI / Charts)"]
        TQ["TanStack Query (Cache & State)"]
        UI --> Grid
        UI --> Charts
        UI --> TQ
    end

    subgraph Service ["Unified Container (Node 20 / Express)"]
        Static["Static Asset Middleware (frontend/dist)"]
        Router["Express Router (/api)"]
        Val["Zod Validation Boundary"]
        Ctrl["Controllers"]
        Svc["Domain Services (Business Logic)"]
        Repo["Repositories (Prisma & Raw SQL)"]

        Router --> Val
        Val --> Ctrl
        Ctrl --> Svc
        Svc --> Repo
    end

    subgraph Database ["Data Store (PostgreSQL)"]
        PG[("PostgreSQL DB (10,000 Employees)")]
        Idx["Composite Indexes: (country, currency), salary, etc."]
        PG --- Idx
    end

    TQ -->|"HTTP REST (/api/*)"| Router
    Browser -->|"HTTP GET /* (Static SPA Assets)"| Static
    Repo -->|"SQL Aggregations & percentile_cont"| PG
```

### Technology Matrix
| Layer | Technology | Rationale |
|---|---|---|
| **Backend** | Node.js 20, Express, TypeScript (strict) | Clean architecture (Routes -> Controllers -> Services -> Repositories). |
| **Validation** | Zod | Runtime validation and inferred TypeScript types at every boundary. |
| **Database** | PostgreSQL (Neon) | Native continuous percentiles (`percentile_cont`), window functions, and B-tree indexes. |
| **ORM & DB Access** | Prisma ORM | Type-safe migrations and client generation, with raw SQL for percentiles. |
| **Frontend** | React 18, Vite, TypeScript | Instant Hot Module Replacement and modular components. |
| **UI Components** | MUI (Material UI), MUI X DataGrid, MUI X Charts | Accessible data grid with server-side pagination, sorting, and charts. |
| **Server State** | TanStack Query (React Query) | Cache management, debounced refetching, and mutation invalidation. |
| **Testing** | Vitest, Supertest, React Testing Library | Fast, TS-native test runner with 100% deterministic hermetic tests. |
| **Deployment** | Docker (Render) | Single web service serving API and compiled React SPA (zero CORS). |

---

## 📁 Repository Structure

```text
salary-management-assessment/
├── backend/
│   ├── prisma/
│   │   ├── migrations/       # SQL migration history
│   │   ├── schema.prisma     # Prisma schema with mappings & indexes
│   │   └── seed.ts           # 10k deterministic employee seeder
│   ├── src/
│   │   ├── controllers/      # Express controllers (HTTP orchestration)
│   │   ├── db/               # Prisma client singleton
│   │   ├── middleware/       # Error handling, rate limiting, logging, static serving
│   │   ├── repositories/     # Prisma and in-memory repository implementations
│   │   ├── routes/           # REST endpoints
│   │   ├── schemas/          # Zod validation schemas
│   │   ├── seed/             # Pure deterministic employee generator
│   │   ├── services/         # Pure domain logic (EmployeeService, InsightsService)
│   │   ├── utils/            # Custom errors (NotFoundError, ConflictError)
│   │   ├── app.ts            # Configured Express application factory
│   │   └── server.ts         # Server entrypoint with graceful shutdown
│   └── tests/                # Vitest unit, service, and Supertest integration tests
├── frontend/
│   ├── src/
│   │   ├── api/              # Typed API client & TanStack Query hooks
│   │   ├── components/       # Layout, Navigation, ConfirmDeleteDialog
│   │   ├── features/
│   │   │   ├── employees/    # DataGrid, EmployeeFilters, EmployeeDialog
│   │   │   └── insights/     # SummaryCards, CompensationTable, Charts, TopEarners
│   │   ├── hooks/            # useDebounce custom hook
│   │   ├── types/            # TypeScript interfaces
│   │   ├── utils/            # Currency and date formatters
│   │   ├── App.tsx           # Route layout and TanStack provider
│   │   └── main.tsx          # DOM root
│   └── tests/                # React Testing Library component and util tests
├── docs/
│   ├── requirements.md       # One-page requirements specification
│   ├── design.md             # System architecture, data model, and API contracts
│   ├── performance.md        # EXPLAIN ANALYZE benchmarks and hardening analysis
│   ├── thinking-process.md   # First-person engineering decision log
│   ├── adr/
│   │   └── 001-tech-choices.md # Architectural Decision Records
│   └── prompts/              # Staged AI prompts used across all milestones
├── Dockerfile                # Multi-stage production container
├── render.yaml               # Render Blueprint configuration
└── AGENTS.md                 # Agent working agreements and craftsmanship standards
```

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js `v20.x` or higher
- npm `v10.x` or higher
- PostgreSQL instance (local or Neon free tier)

### 1. Clone Repository
```bash
git clone https://github.com/parth-r-parmar/Salary-Management-Assessment.git
cd Salary-Management-Assessment
```

### 2. Configure Backend Environment
Copy the example environment file:
```bash
cp backend/.env.example backend/.env
```
Update `DATABASE_URL` in `backend/.env` with your PostgreSQL connection string:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://user:password@localhost:5432/salary_db?sslmode=require"
```

### 3. Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
cd ..
```

### 4. Run Migrations & Seed Database (10,000 Employees)
```bash
cd backend
# Generate Prisma client
npx prisma generate

# Apply migrations
npx prisma migrate deploy

# Seed 10,000 deterministic employees (runs in ~10-15 seconds)
npm run seed
cd ..
```

### 5. Start Development Servers
In Terminal 1 (Backend):
```bash
cd backend
npm run dev
# Server running at http://localhost:5000
```

In Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
# Vite dev server running at http://localhost:5173 (proxies /api to 5000)
```

Open `http://localhost:5173` in your browser.

---

## 🧪 Running Tests

Both backend and frontend have comprehensive, fast, deterministic test suites running on **Vitest**.

### Backend Tests (58 tests)
```bash
cd backend
npm test
```
*Covers: Zod schemas, in-memory repository fakes, EmployeeService, InsightsService, deterministic seed generation, health check, and Supertest REST integration tests.*

### Frontend Tests (12 tests)
```bash
cd frontend
npm test
```
*Covers: App smoke test, formatters (`formatSalary`, `formatDate`), `EmployeeFilters`, `ConfirmDeleteDialog`, `SummaryCards`, and `CompensationTable`.*

---

## ⚡ Performance & Scalability Highlights

- **Sub-second Pagination**: Server-side offset pagination with indexed columns (`(country, currency)`, `annual_salary`, `email`) returns in **< 5ms** at 10,000 rows.
- **Database-Native Continuous Percentiles**: Median (P50), P25, and P75 calculated directly in PostgreSQL using `percentile_cont(...) WITHIN GROUP (ORDER BY annual_salary)` in **< 15ms**, avoiding Node.js memory pressure.
- **Strict Currency Integrity**: Zero mixed currency aggregations. Every aggregate is grouped by or filtered to a single currency.
- **Hardening**: Rate limiting (300 requests/15m via `express-rate-limit`), Helmet security headers, structured Pino logging, and graceful shutdown on SIGTERM/SIGINT.
- Full benchmarks available in [docs/performance.md](docs/performance.md).

---

## 🎯 Deliberately Out of Scope
1. **Authentication & Roles**: Assuming internal HR network access to focus on data craftsmanship and query performance.
2. **Foreign Exchange (FX) Conversion**: Speculative currency rates distort actual pay; currencies are strictly separated.
3. **Payroll & Tax Deductions**: Focus is kept on gross annual salary.
4. **Historical Salary Versioning**: Omitted to prioritize core administration and analytical latency.
5. **Bulk Excel Upload UI**: Initial data loaded via automated 10k seeder.

---

## 🤖 AI-Assisted Development & Engineering Craftsmanship

AI tools were used as development collaborators, with implementation decisions and verification guided by explicit requirements, tests, and engineering constraints.

- **Plan before implementation**: Each stage began with a plan and clear verification criteria.
- **Working agreements (`AGENTS.md`)**: Defined project conventions, including the Red-Green-Refactor TDD cycle, avoiding `any`, validating HTTP inputs with Zod, and using conventional commit messages.
- **Staged prompt playbook (`docs/prompts/`)**: Broke the work into 14 incremental stages so each part could be implemented and reviewed independently.
- **Review and correction**:
  - Resolved peer-dependency compatibility between `@mui/x-charts` and `@mui/material` by pinning a compatible chart-library version.
  - Kept salary percentile calculations in PostgreSQL using `percentile_cont` rather than calculating them in application memory.
  - Added the required SQL type handling to avoid `BigInt` JSON serialization issues.
- **Verification**: Used the automated test suites and reviewed key architectural decisions rather than treating AI-generated output as automatically correct.

For the detailed decision log, see [docs/thinking-process.md](docs/thinking-process.md).
