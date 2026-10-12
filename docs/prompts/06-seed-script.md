# Stage 6: Seed Script (10,000 Employees)

## Prompt:
Create backend/prisma/seed.ts plus a pure generator in backend/src/seed/generateEmployees.ts.

Requirements:
- Exactly 10,000 employees, deterministic using @faker-js/faker with a fixed seed.
- 8 to 10 countries (e.g. IN, US, GB, DE, CA, AU, SG, FR, AE, BR) with matching currency codes and country-appropriate salary ranges.
- ~8 departments, ~30 job titles mapped to departments, realistic salary bands per title and seniority (multiplier), plus a country salary multiplier.
- Guaranteed unique emails.
- Insert in batches of 1000 using createMany. Idempotent (clear the table first).
- Log total time and row count.

TDD: first write unit tests for generateEmployees (count, unique emails, valid country-currency pairs, salary within band, same seed gives same output). Then implement the generator, then the seed script. Run the seed and report the time taken. Append an entry to docs/thinking-process.md.
