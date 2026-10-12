# Stage 13: Deploy, Docker, and README

## Prompt:
Prepare the project for a single-service deployment on Render using Docker.

- Add a multi-stage Dockerfile at the repo root: build the frontend, build the backend, then a slim runtime image that contains the compiled backend, node_modules (production), the Prisma client, and frontend/dist, and starts the server. Make sure Prisma works in the slim image (OpenSSL).
- Migrations are NOT run on container start (the prisma CLI is a dev dependency). They are run manually from my machine and documented in the README. The server reads PORT from the environment and exposes GET /health.
- Add a .dockerignore.
- Write the root README.md: overview, live URL, demo video URL (placeholders), tech stack, architecture summary (link docs), local setup step by step, env vars, how to run tests, how to seed, folder structure, key decisions, what was deliberately left out, and "How I used AI" (Antigravity Planning mode, AGENTS.md rules, staged prompts in docs/prompts, TDD with AI, what I reviewed or rejected).
- Do not include secrets.
