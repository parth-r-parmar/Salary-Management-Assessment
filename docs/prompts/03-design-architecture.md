# Stage 3: Design, Architecture, and Thinking Process

## Prompt:
Read docs/requirements.md and AGENTS.md. Create docs/design.md covering:
1. Architecture diagram (Mermaid): React UI -> Express API -> Prisma -> PostgreSQL. Note that in production Express also serves the built React app as static files (single deployable service).
2. Folder structure for /backend (routes, controllers, services, repositories, schemas, middleware, utils) and /frontend (features/employees, features/insights, components, api, hooks).
3. Data model for Employee: id (uuid), fullName, email (unique), jobTitle, department, country (ISO code), currency (ISO code), annualSalary (Decimal 12,2), employmentType (FULL_TIME | PART_TIME | CONTRACT), hireDate, createdAt, updatedAt. Suggest indexes for filtering and aggregation (country, department, jobTitle, annualSalary) and justify each.
4. REST API contract with request/response JSON shapes and an error format:
   - GET /api/employees (page, pageSize, search, country, department, sortBy, sortOrder)
   - GET /api/employees/:id, POST, PUT, DELETE
   - GET /api/insights/summary, /by-country, /by-department, /by-job-title (min, avg, median, p25, p75, max, headcount), /distribution, /top-earners
   - GET /api/meta/filters (distinct countries and departments)
5. Key trade-offs: offset vs keyset pagination, Prisma vs raw SQL for percentiles, no FX conversion, no auth, aggregation in DB vs app, single service deploy vs split.
6. Performance considerations for 10,000 rows.

Also write docs/adr/001-tech-choices.md with short ADRs for Express, PostgreSQL, Prisma, MUI, Vitest, and single-service deployment.

Then create docs/thinking-process.md, written in first person, with these sections: "How I approached the problem", "Key decisions and alternatives", "How I'm using AI (Planning mode, staged prompts, rules in AGENTS.md)", "Where I corrected the AI" (empty for now, to be filled as we go), "What I'd do next". Fill the first two sections from the design work done so far. Keep it concise and honest.
