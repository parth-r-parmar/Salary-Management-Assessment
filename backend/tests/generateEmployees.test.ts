import { describe, it, expect } from 'vitest';
import { generateEmployees, COUNTRY_CURRENCY_MAP } from '../src/seed/generateEmployees';

describe('generateEmployees', () => {
  it('generates the exact requested number of employees', () => {
    const employees = generateEmployees(100, 42);
    expect(employees).toHaveLength(100);
  });

  it('produces deterministic output for the same seed', () => {
    const run1 = generateEmployees(50, 12345);
    const run2 = generateEmployees(50, 12345);
    expect(run1).toEqual(run2);
  });

  it('generates unique email addresses across all employees', () => {
    const count = 1000;
    const employees = generateEmployees(count, 42);
    const emails = new Set(employees.map(e => e.email.toLowerCase()));
    expect(emails.size).toBe(count);
  });

  it('assigns valid country-currency pairs according to ISO specifications', () => {
    const employees = generateEmployees(200, 42);
    for (const emp of employees) {
      expect(COUNTRY_CURRENCY_MAP[emp.country]).toBe(emp.currency);
    }
  });

  it('ensures all employees have valid positive salaries and sensible employment types', () => {
    const employees = generateEmployees(200, 42);
    const validTypes = ['FULL_TIME', 'PART_TIME', 'CONTRACT'];
    for (const emp of employees) {
      expect(emp.annualSalary).toBeGreaterThan(0);
      expect(validTypes).toContain(emp.employmentType);
      expect(emp.fullName.trim().length).toBeGreaterThan(0);
      expect(emp.jobTitle.trim().length).toBeGreaterThan(0);
      expect(emp.department.trim().length).toBeGreaterThan(0);
      expect(emp.hireDate).toBeInstanceOf(Date);
    }
  });
});
