# Stage 5: Database Schema and Migration

## Prompt:
Implement the Prisma schema for Employee exactly as in docs/design.md, with the agreed indexes and an enum for employmentType. Use @map/@@map so database columns and tables are snake_case (e.g. annual_salary, employees) while the Prisma model fields stay camelCase; this keeps the raw SQL in Stage 8 readable. Create the initial migration. Add a Prisma client singleton in backend/src/db/client.ts. Do not seed yet. Note for later stages: Prisma returns Decimal objects for money, so the API layer must convert them to numbers explicitly before sending JSON.

Explain how tests avoid a real database: service tests use an in-memory fake repository; only a small number of integration tests use the test DB. Append an entry to docs/thinking-process.md.
