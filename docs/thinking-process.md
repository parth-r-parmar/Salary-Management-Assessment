# Engineering Thinking Process & Design Log

*Author: Parth Parmar*

---

## 1. How I Approached the Problem
When faced with ACME org's salary management challenge, my starting point was empathy for the HR Manager persona. Managing 10,000 employee salaries across multiple countries in spreadsheets is prone to formula corruptions, concurrency clashes, and agonizing delays when leadership asks simple questions like *"What is our median engineering compensation in Germany versus India?"*

Instead of treating this as a generic CRUD application, I framed it around two primary pillars:
1. **High-throughput, responsive record administration**: Server-side pagination, instant debounced search, strict Zod validation, and transactional data integrity.
2. **Accurate compensation analytics**: Direct database-level calculation of statistical metrics (min, P25, median, P75, max, average) without mixing disparate currencies.

I adopted a disciplined staged execution model, beginning with explicit agent rules, clear architectural boundaries, and test-driven development (TDD) before writing production code.

---

## 2. Key Decisions and Alternatives Considered

- **Layered Architecture over Framework Bloat**:
  I opted for Express with strict TypeScript layered into Routes -> Controllers -> Services -> Repositories. This avoids the heavy cognitive overhead of NestJS while enforcing clean separation of concerns. The domain service depends on a repository interface, enabling instant in-memory unit testing without spinning up test databases for every test run.
- **PostgreSQL over SQLite**:
  While SQLite is zero-configuration, it lacks native `percentile_cont` continuous distribution functions required for median and quartile compensation analytics. PostgreSQL handles continuous percentiles natively and scales effortlessly to millions of rows.
- **No Currency Mixing**:
  Converting local salaries to USD using arbitrary exchange rates creates misleading reporting and false equity comparisons because FX rates fluctuate daily. I enforced strict grouping and filtering by currency across all analytics and summaries.
- **Offset Pagination vs Keyset**:
  For 10,000 records, offset pagination with indexed columns (`ORDER BY hire_date` or `annual_salary`) runs in single-digit milliseconds while enabling direct page jumping in MUI DataGrid. If data grew to 10+ million records, I would migrate to cursor-based keyset pagination.
- **Unified Single-Container Deployment**:
  Rather than splitting into separate frontend (Vercel) and backend (Render) deployments with CORS configuration and multiple DNS hops, Express serves the compiled Vite React frontend in production. One environment, one health check, zero CORS issues.

---

## 3. How I'm Using AI

- **Antigravity Planning Mode**:
  I use Antigravity in structured Planning mode. Every stage begins with an implementation plan detailing file changes, verification criteria, and trade-offs before executing.
- **Staged AI Prompts (`docs/prompts/`)**:
  Rather than asking AI for a monolithic full-stack app in one shot (which causes hallucinations and skipped tests), I decoupled the project into 14 progressive, verifiable stages.
- **Pre-set Agent Rules (`AGENTS.md`)**:
  I configured strict workspace rules and custom skills (`tdd-cycle`, `conventional-commit`) so the AI consistently follows TDD (Red-Green-Refactor), disallows `any`, validates inputs with Zod, and writes meaningful conventional commits.

---

## 4. Where I Corrected the AI
*(Will be updated incrementally throughout implementation stages)*

---

## 5. What I'd Do Next (Future Enhancements)
- Role-Based Access Control (RBAC) separating HR Business Partners, Comp Admins, and Executives.
- Complete compensation audit trail (salary adjustment history, effective dates, approver notes).
- Bulk CSV/Excel batch upload with preview, dry-run validation, and diff summaries.
- Historical inflation/FX point-in-time modeling for global compensation benchmarking.
- Redis caching or PostgreSQL materialized views for high-frequency dashboard analytics as employee volume scales to 500,000+.

---

## Stage-by-Stage Log

### Stage 1: AI Agent Setup & Rules
- **Decision**: Defined explicit `AGENTS.md`, workspace rules, `.gitignore`, and custom skills (`tdd-cycle`, `conventional-commit`).
- **Alternatives**: Ad-hoc prompting without persistent workspace rules.
- **Why**: Establishes reproducible engineering guardrails, preventing AI drift and ensuring strict TDD and conventional commits.

### Stage 2: One-Page Requirements Document
- **Decision**: Kept `docs/requirements.md` under 400 words with sharp boundaries on what is deliberately out of scope (auth, FX, tax breakdown).
- **Alternatives**: Comprehensive 15-page enterprise specification.
- **Why**: Focuses engineering effort on core product value and sub-second performance for the HR Manager persona.

### Stage 3: Architecture & Design
- **Decision**: Documented end-to-end architecture with Mermaid diagrams, REST API contracts, data model with indexes, and ADR 001.
- **Alternatives**: Jumping directly into code scaffolding.
- **Why**: Clarifies domain interfaces, error response formats, and percentile computation strategies before writing code.

### Stage 4: Monorepo Scaffolding
- **Decision**: Decoupled Express backend and Vite/React frontend while configuring dev proxy and single-container production static asset serving.
- **Alternatives**: Full Next.js full-stack app or completely separated microservices with cross-origin CORS.
- **Why**: Keeps frontend and backend testable independently with instant Vite HMR, while Express static serving eliminates production CORS overhead completely.

