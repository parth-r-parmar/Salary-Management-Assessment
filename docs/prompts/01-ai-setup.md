# Stage 1: AI Setup Files (Agent Rules, Skills, Prompts)

## Prompt:
Set up the AI-assisted development foundation for this repo. Do NOT write application code yet.

1. Create AGENTS.md at the repo root with these sections:
   - Project: Salary management web app for an HR Manager of an org with 10,000 employees across multiple countries.
   - Stack: Node 20, Express, TypeScript (strict), Zod, Prisma, PostgreSQL; React, Vite, TypeScript, MUI, TanStack Query; Vitest, Supertest, React Testing Library.
   - Structure: /backend (routes -> controllers -> services -> repositories), /frontend (features/*, components, api, hooks), /docs.
   - Working agreement:
     * Always propose a plan and wait for approval before writing code.
     * TDD: failing test first, minimal code, then refactor.
     * No `any`. Validate all input with Zod. Business logic never in routes or JSX.
     * Tests must be fast, deterministic, readable (Arrange-Act-Assert). No real network, no sleeps, no unseeded randomness.
     * Do not add features that are not in docs/requirements.md.
     * Never mix currencies in aggregates.
     * Conventional Commits, small incremental commits, never commit secrets.
     * After each stage, append a short entry (3 to 5 lines: decision, alternatives considered, why) to docs/thinking-process.md.
2. Create the workspace rule file(s) in the location Antigravity uses for workspace rules (verify the correct folder from Antigravity's docs or settings rather than guessing, commonly .agent/rules/ or .agents/AGENTS.md) that instruct the agent to follow AGENTS.md.
3. Create 2 small, focused skills in Antigravity's skills location (.agents/skills/<name>/SKILL.md):
   - "tdd-cycle": steps for red, green, refactor in this repo, with how to run tests.
   - "conventional-commit": how to write commit messages for this repo, with examples.
   Keep each under 40 lines.
4. Create .gitignore (node_modules, dist, coverage, .env, .env.*.local, *.log, .DS_Store) and an empty docs/prompts/ folder with a .gitkeep.
5. Summarize what was created and where.
