---
name: tdd-cycle
description: Guide for applying Red-Green-Refactor test-driven development workflow in this repository.
---

# TDD Cycle Workflow

1. **Red**: Write a focused, failing unit test in Vitest verifying expected behavior.
   - Run tests: `npm test` in `/backend` or `/frontend`.
   - Ensure the test fails for the expected reason (e.g. missing function or incorrect logic).
2. **Green**: Write minimal code necessary to make the failing test pass.
   - Do not add extraneous abstractions or unrequested features.
   - Ensure all tests pass cleanly.
3. **Refactor**: Clean up the code while tests stay green.
   - Enforce strict TypeScript types, readability, and DRY principles without altering behavior.
4. **Commit**: Make an atomic commit documenting the change (e.g. `test: ...` or `feat: ...`).
