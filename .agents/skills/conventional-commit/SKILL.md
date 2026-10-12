---
name: conventional-commit
description: Guide and standard examples for writing Conventional Commits in this repository.
---

# Conventional Commit Guidelines

Use the standard format: `<type>(<optional scope>): <description>`

### Types
- `feat`: New feature or user-facing functionality
- `test`: Adding or refactoring automated tests
- `fix`: Bug fix
- `chore`: Scaffolding, dependency updates, tooling configuration
- `docs`: Documentation updates (requirements, ADR, thinking process)
- `perf`: Performance improvements, query optimization, indexing
- `refactor`: Code changes that neither fix a bug nor add a feature

### Examples
- `feat(seed): add deterministic 10k employee generator`
- `test(employee): add validation schema test for salary constraints`
- `docs: add one-page requirements document`
- `perf: add composite indexes for department salary queries`
