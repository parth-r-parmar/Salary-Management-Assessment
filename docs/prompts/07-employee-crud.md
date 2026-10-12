# Stage 7: Employee CRUD (TDD)

## Prompt:
Implement the Employees API per docs/design.md using strict TDD, one small step at a time, and commit after each green step.

1. Zod schemas (create, update, list query) with tests: required fields, email format, salary > 0, valid country/currency, pageSize max 100.
2. Repository interface plus Prisma implementation. The service depends on the interface so it can be unit tested with an in-memory fake repository.
3. Service tests first (create, update, delete, get not found -> NotFoundError, duplicate email -> ConflictError, list with pagination, search, filters, sorting), then implementation.
4. Controllers and routes, a central error-handling middleware returning { error: { code, message, details } }, and Supertest tests per endpoint.
5. Whitelist sortBy fields. Search is case-insensitive on name, email and job title.

Do not skip the failing-test-first step. Append an entry to docs/thinking-process.md at the end.
