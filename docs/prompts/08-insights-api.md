# Stage 8: Insights / Analytics API (TDD)

## Prompt:
Implement the /api/insights endpoints per docs/design.md.

- Aggregations are done in PostgreSQL, not in application memory.
- Use Prisma groupBy for count/min/avg/max, and $queryRaw with percentile_cont(0.5/0.25/0.75) WITHIN GROUP (ORDER BY annual_salary) for median and quartiles.
- Never mix currencies: every aggregate is grouped by or filtered to one currency, and responses include the currency code. /summary returns headcount, number of countries, and total annual payroll per currency.
- /distribution returns salary buckets for a given country (bucket size configurable with a sane default).
- /top-earners returns the top N (default 10) with an optional country filter.
- TDD: write service tests with a fake repository returning fixed aggregates and assert response shaping, rounding and currency handling first. Then add a few integration tests against the test DB with ~20 hand-written rows where median/p25/p75 are verifiable by hand.
- Keep SQL in the repository layer only.
- Serialization gotcha: $queryRaw returns COUNT as BigInt and numeric values as Decimal, and JSON.stringify fails on BigInt. Cast counts to int in SQL or convert in the repository, convert all Decimals to numbers before responding, and add a test that proves the JSON response serializes.

Append an entry to docs/thinking-process.md.
