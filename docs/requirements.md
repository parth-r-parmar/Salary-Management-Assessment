# Product Requirements Document: Salary Management System

## 1. Goal
Provide ACME org's HR Manager with a web-based salary management platform to replace error-prone spreadsheets, administer salary records for 10,000 global employees, and answer critical organizational compensation questions with sub-second analytics.

## 2. User Persona & Key Questions
- **Persona**: HR Manager (single administrative operator).
- **Core Questions Answered**:
  - What is the total headcount and annual payroll expenditure across each operational currency?
  - What are the average, median, minimum, 25th percentile (P25), 75th percentile (P75), and maximum salaries by country, department, and job title?
  - What does the salary distribution look like within a given country?
  - Who are the highest-earning employees across the org or within a specific country?
  - Are compensation bands aligned across job titles and departments?

## 3. Scope & Features
- **Employee Directory**:
  - Paginated table rendering up to 10,000 records using server-side pagination, sorting, and debounced search (by name, email, job title).
  - Multi-attribute filtering by country and department.
  - Formatted currency displays aligned with employee country ISO standards.
- **Employee Administration (CRUD)**:
  - Add new employee with strict validation (required fields, positive salary, valid country/currency ISO codes).
  - Edit existing employee details with instant optimistic/server validation.
  - Delete employee with confirmation dialog and snackbar feedback.
- **Compensation Insights Dashboard**:
  - High-level KPI cards (Total Headcount, Country Count, Total Payroll by Currency).
  - Tabulated compensation analytics by Country, Department, and Job Title.
  - Country-specific salary distribution histogram/chart.
  - Top 10 organizational and country-level earners.

## 4. Deliberately Out of Scope
1. **Authentication & RBAC**: Internal HR network access assumed; omitted to focus on data craftsmanship and query performance.
2. **Foreign Exchange (FX) Conversion**: Currency conversion introduces speculative currency risk; currencies are strictly aggregated independently.
3. **Payroll/Tax/Bonus Breakdown**: Focus is bounded strictly to base annual gross salary.
4. **Historical Audit Trail**: Versioning deferred to future iterations to prioritize core CRUD and analytical latency.
5. **Bulk Excel/CSV Import UI**: Initial data loaded via automated deterministic 10k database seeder.
6. **Multi-Tenancy & Notifications**: Single-tenant application dedicated solely to ACME org.

## 5. Key Assumptions
- All compensation numbers represent **annual gross salary**.
- Each employee is tied to their country's official local currency.
- With 10,000 records, server-side pagination and database indexing are mandatory.

## 6. Success Criteria
- Employee list queries respond in **< 1000ms** at 10,000 records.
- Analytics/insights aggregations respond in **< 500ms**.
- Deterministic 10,000 employee seed completes in **< 30s**.
- 100% deterministic, hermetic test suite passing across backend and frontend.
