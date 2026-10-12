# Stage 12: Performance and Hardening

## Prompt:
Review performance for 10,000 employees.
1. Run EXPLAIN ANALYZE on the list query (with filters and sort) and on each insights query. Record timings in docs/performance.md and confirm indexes are used. Add or remove indexes only if the output justifies it.
2. Verify there are no N+1 queries, pageSize is capped, and the frontend never fetches all rows.
3. Add basic hardening: confirm helmet and pino (added in Stage 4) are wired correctly, and add rate limiting on /api, graceful shutdown, and verify central error handling. (CORS is not needed in production because the API and UI share one origin.)
4. Document trade-offs: offset vs keyset pagination at larger scale, caching insights, materialized views if rows grow to millions.

Append an entry to docs/thinking-process.md.
