# Stage 4: Scaffold the Monorepo

## Prompt:
Scaffold the project per docs/design.md. Do NOT implement features yet.

Backend (/backend): Express, TypeScript (strict), Zod, Prisma, Vitest, Supertest, tsx for dev, ESLint + Prettier, dotenv, helmet, pino. Create app.ts (builds and exports the express app for tests) separate from server.ts (starts listening). Add GET /health with a passing Supertest test. Scripts: dev, build, start, test, test:watch, lint, seed, prisma:migrate. Add .env.example (DATABASE_URL, PORT, NODE_ENV).

Frontend (/frontend): Vite + React + TypeScript, MUI, @mui/x-data-grid, TanStack Query, React Router, Vitest + React Testing Library + jsdom. Configure the Vite dev server proxy so /api goes to the backend (so no CORS is needed). Basic layout with AppBar and two nav items (Employees, Insights) and placeholder pages. One passing smoke test.

In production mode, make Express serve frontend/dist as static files with an SPA fallback to index.html for non-/api routes (implement this in a small, tested module).

Make two commits as noted. Confirm all tests pass. Append an entry to docs/thinking-process.md.
