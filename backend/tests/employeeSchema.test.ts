import { describe, it, expect } from 'vitest';
import {
  createEmployeeSchema,
  updateEmployeeSchema,
  listEmployeesQuerySchema,
} from '../src/schemas/employeeSchema';

describe('employeeSchema', () => {
  describe('createEmployeeSchema', () => {
    const validData = {
      fullName: 'Alice Walker',
      email: 'alice.walker@acme.org',
      jobTitle: 'Senior Software Engineer',
      department: 'Engineering',
      country: 'US',
      currency: 'USD',
      annualSalary: 120000,
      employmentType: 'FULL_TIME',
      hireDate: '2022-05-15',
    };

    it('validates a correct employee creation payload', () => {
      const parsed = createEmployeeSchema.safeParse(validData);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.annualSalary).toBe(120000);
        expect(parsed.data.hireDate).toBeInstanceOf(Date);
      }
    });

    it('rejects an invalid email format', () => {
      const parsed = createEmployeeSchema.safeParse({ ...validData, email: 'not-an-email' });
      expect(parsed.success).toBe(false);
    });

    it('rejects salary less than or equal to 0', () => {
      const parsedZero = createEmployeeSchema.safeParse({ ...validData, annualSalary: 0 });
      const parsedNegative = createEmployeeSchema.safeParse({ ...validData, annualSalary: -500 });
      expect(parsedZero.success).toBe(false);
      expect(parsedNegative.success).toBe(false);
    });

    it('rejects invalid country or currency length', () => {
      const parsedCountry = createEmployeeSchema.safeParse({ ...validData, country: 'USA' });
      const parsedCurrency = createEmployeeSchema.safeParse({ ...validData, currency: 'US' });
      expect(parsedCountry.success).toBe(false);
      expect(parsedCurrency.success).toBe(false);
    });

    it('rejects invalid employmentType', () => {
      const parsed = createEmployeeSchema.safeParse({ ...validData, employmentType: 'INTERN' });
      expect(parsed.success).toBe(false);
    });

    it('rejects missing required fields', () => {
      const { fullName, ...incomplete } = validData;
      const parsed = createEmployeeSchema.safeParse(incomplete);
      expect(parsed.success).toBe(false);
    });
  });

  describe('updateEmployeeSchema', () => {
    it('allows partial fields for updates', () => {
      const parsed = updateEmployeeSchema.safeParse({
        annualSalary: 135000,
        jobTitle: 'Lead Software Engineer',
      });
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.annualSalary).toBe(135000);
        expect(parsed.data.jobTitle).toBe('Lead Software Engineer');
      }
    });

    it('validates updated fields when provided', () => {
      const parsed = updateEmployeeSchema.safeParse({
        annualSalary: -100,
      });
      expect(parsed.success).toBe(false);
    });
  });

  describe('listEmployeesQuerySchema', () => {
    it('applies defaults for empty query', () => {
      const parsed = listEmployeesQuerySchema.safeParse({});
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.page).toBe(1);
        expect(parsed.data.pageSize).toBe(25);
        expect(parsed.data.sortOrder).toBe('desc');
        expect(parsed.data.sortBy).toBe('createdAt');
      }
    });

    it('coerces string page and pageSize to numbers', () => {
      const parsed = listEmployeesQuerySchema.safeParse({
        page: '3',
        pageSize: '50',
      });
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.page).toBe(3);
        expect(parsed.data.pageSize).toBe(50);
      }
    });

    it('rejects pageSize greater than 100', () => {
      const parsed = listEmployeesQuerySchema.safeParse({
        pageSize: '150',
      });
      expect(parsed.success).toBe(false);
    });

    it('validates sortBy allowed enum values', () => {
      const valid = listEmployeesQuerySchema.safeParse({ sortBy: 'annualSalary' });
      const invalid = listEmployeesQuerySchema.safeParse({ sortBy: 'secretField' });
      expect(valid.success).toBe(true);
      expect(invalid.success).toBe(false);
    });
  });
});
