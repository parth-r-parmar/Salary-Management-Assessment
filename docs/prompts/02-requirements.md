# Stage 2: Requirements Document (One Page)

## Prompt:
Create docs/requirements.md, a ONE-PAGE requirements document (max ~400 words) for an employee salary management web app.

Context: ACME org has 10,000 employees across multiple countries. Salary data lives in Excel. The only user is the HR Manager. They need to manage salary data and answer questions about how the org pays people.

Sections:
1. Goal
2. Users and the key questions the HR Manager needs answered (average/median salary by country, by job title, by department; headcount; payroll cost; pay ranges; highest and lowest paid; salary distribution)
3. In scope / features: employee list with search, filter, sort and server-side pagination; add/edit/delete employee; insights dashboard
4. Deliberately out of scope, with a one-line reason each: authentication and roles, currency conversion (FX), payroll/tax/bonus/equity breakdown, salary history and audit trail, Excel import UI, multi-tenant, notifications
5. Key assumptions: annual salary, one currency per employee based on country, ~10k rows so server-side pagination is required, single HR user
6. Success criteria: list loads under 1s with 10k rows, insights queries under 500ms, seed script runs under 30s
