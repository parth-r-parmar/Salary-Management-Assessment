# ADR 001: Core Technology Choices & Architectural Foundations

## Status
Accepted

## Context
ACME org requires a robust, production-grade salary management solution for an HR Manager administering 10,000 employees globally. The platform must provide sub-second query latency, statistical analysis (median, quartiles, distributions), and exceptional developer ergonomics with high test confidence.

## Decision Drivers
- Strong alignment with the Software Craftsperson role (Node.js, React, TypeScript).
- Mathematical correctness for financial and statistical compensation queries.
- Fast, deterministic testing with rapid local feedback cycles.
- Single deployable artifact to reduce deployment complexity and eliminate cross-origin friction.

---

## Decisions

### 1. Backend: Node.js 20 + Express + TypeScript
- **Decision**: Use Node.js 20 LTS with Express and TypeScript in strict mode.
- **Alternatives**: NestJS, Fastify, Go.
- **Rationale**: Express is minimal, unopinionated, battle-tested, and transparent. When layered cleanly (routes -> controllers -> services -> repositories), it demonstrates clean architecture fundamentals without framework bloat. Strict TypeScript ensures compile-time safety across all layers.

### 2. Database: PostgreSQL with Prisma ORM
- **Decision**: Use PostgreSQL with Prisma ORM.
- **Alternatives**: SQLite, MongoDB, TypeORM, Drizzle.
- **Rationale**: SQLite lacks native percentile aggregate functions (`percentile_cont`). PostgreSQL provides industrial-strength aggregation, window functions, and B-tree indexing. Prisma provides type-safe migrations and client generation, with raw SQL escape hatches (`$queryRaw`) for complex percentile calculations.

### 3. Frontend: React 18 + Vite + Material UI (MUI) + MUI X DataGrid
- **Decision**: Use React 18 bundled with Vite, styled with Material UI and MUI X DataGrid.
- **Alternatives**: Next.js, Plain HTML/CSS, TailwindCSS.
- **Rationale**: Vite provides instant Hot Module Replacement (HMR). MUI and MUI X DataGrid offer enterprise-grade accessible table components with built-in server-side pagination, sorting, and keyboard navigation.

### 4. State Management: TanStack Query (React Query)
- **Decision**: TanStack Query for server state management.
- **Alternatives**: Redux Toolkit, Zustand, useEffect + useState.
- **Rationale**: Eliminates boilerplate for asynchronous request states, caching, pagination invalidation, and debounced query refetching.

### 5. Testing: Vitest + Supertest + React Testing Library
- **Decision**: Standardize on Vitest across both backend and frontend.
- **Alternatives**: Jest, Mocha.
- **Rationale**: Vitest runs natively with TypeScript and ESM without complex Babel/ts-jest transforms. It executes in milliseconds, supports parallel runs, and shares a unified runner syntax across client and server.

### 6. Deployment: Single Docker Web Service
- **Decision**: Unified Docker image where Express serves compiled React assets.
- **Alternatives**: Split deployment (Frontend on Vercel/Netlify, Backend on Render/Fly.io).
- **Rationale**: Eliminates CORS configurations, prevents cross-service latency and independent cold-starts, simplifies environment variable management, and provides one stable URL for evaluation.

---

## Consequences
- **Positive**: High test velocity, single deployable target, robust DB-native percentiles, zero CORS in production.
- **Negative**: Raw SQL required for Postgres percentiles since Prisma ORM does not support `percentile_cont` in its fluent API. Handled cleanly inside repository layer with automated type casting.
