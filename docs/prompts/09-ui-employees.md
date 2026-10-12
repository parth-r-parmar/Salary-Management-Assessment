# Stage 9: UI - Employees Page

## Prompt:
Build the Employees page in /frontend using MUI + MUI X DataGrid.

- Typed API client and TanStack Query hooks in /frontend/src/api (base URL is relative, /api).
- DataGrid with SERVER-SIDE pagination, sorting and filtering (paginationMode="server", sortingMode="server"). Debounced search input (300ms). Country and department filters populated from /api/meta/filters.
- Salary formatted with Intl.NumberFormat using the employee's currency.
- Add/Edit employee dialog with inline validation matching backend rules (react-hook-form + zod resolver).
- Delete with confirmation dialog. Success/error snackbars. Loading and empty states.
- Small components in features/employees/. No business logic in JSX; extract hooks.

Append an entry to docs/thinking-process.md.
