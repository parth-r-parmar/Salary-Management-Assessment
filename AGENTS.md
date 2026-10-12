# AI Agent Guidelines & Architecture Rules

## Project
- **Application**: Employee Salary Management System
- **User Persona**: HR Manager of ACME org (10,000 employees across multiple countries)
- **Primary Need**: Web-based salary data administration, advanced querying, and real-time analytical answers regarding org payroll distributions.

## Tech Stack
- **Backend**: Node.js 20, Express, TypeScript (strict mode), Zod, Prisma ORM, PostgreSQL (Neon / local)
- **Backend Testing**: Vitest, Supertest
- **Frontend**: React 18+, Vite, TypeScript, Material UI (MUI), MUI X DataGrid, TanStack Query (React Query)
- **Frontend Testing**: Vitest, React Testing Library, jsdom
- **Deployment**: Single container (Docker on Render) where Express serves built frontend static assets alongside the API.

## Monorepo Structure
- `/backend`:
  - `routes/` -> Endpoint routing definitions
  - `controllers/` -> HTTP request/response handlers & status codes
  - `services/` -> Core business logic & domain rules
  - `repositories/` -> Database queries & ORM interactions (Prisma / SQL)
  - `schemas/` -> Zod schemas for runtime request/response validation
  - `middleware/` -> Auth, logging, error handling, rate limiting
  - `db/` -> Prisma client instance & DB utilities
- `/frontend`:
  - `src/features/*` -> Feature modules (`employees`, `insights`)
  - `src/components/` -> Shared reusable UI components
  - `src/api/` -> Typed API client & TanStack Query hooks
  - `src/hooks/` -> Custom React hooks
- `/docs`:
  - Architecture specifications, requirements, ADRs, performance benchmarks, and thinking process.

## Working Agreements & Engineering Standards
1. **Planning First**: Always propose a structured plan and verify acceptance criteria before writing code.
2. **Test-Driven Development (TDD)**:
   - Always write a failing test first (Red).
   - Write minimal production code to pass the test (Green).
   - Refactor for cleanliness and maintainability (Refactor).
3. **Type Safety & Strict Validation**:
   - Zero tolerance for `any`.
   - Validate every HTTP boundary (query, params, body) using Zod.
   - Business logic must never live inside route handlers or JSX components.
4. **Fast, Deterministic Tests**:
   - Follow Arrange-Act-Assert (AAA).
   - Unit tests must be hermetic and avoid live network, arbitrary timeouts, or unseeded randomness.
   - Use in-memory fake repositories for service unit tests; reserve live DB tests for repository integration tests.
5. **Strict Scope Control**: Do not add speculative features outside `docs/requirements.md`.
6. **Currency Integrity**: Never mix currencies in aggregates. Every aggregate must be grouped by or filtered to a single currency, always returning the currency code.
7. **Git Hygiene & Conventional Commits**:
   - Keep commits small, atomic, and incremental.
   - Format: `<type>(<scope>): <subject>` (e.g., `feat(seed): add deterministic 10k employee generator`).
   - Never commit secrets or sensitive credentials.
8. **Thinking Process Log**: After completing each stage, append an entry (3 to 5 lines: decision, alternatives considered, why) to `docs/thinking-process.md`.
