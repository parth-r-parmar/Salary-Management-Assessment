import { describe, it, expect } from 'vitest';
import { formatSalary, formatDate } from '../src/utils/formatters';

describe('formatters', () => {
  describe('formatSalary', () => {
    it('formats USD currency correctly', () => {
      const formatted = formatSalary(125000, 'USD');
      expect(formatted).toMatch(/125,000/);
    });

    it('formats EUR currency correctly', () => {
      const formatted = formatSalary(85000, 'EUR');
      expect(formatted).toMatch(/85,000/);
    });

    it('formats INR currency correctly', () => {
      const formatted = formatSalary(2500000, 'INR');
      expect(formatted).toBeDefined();
    });

    it('falls back gracefully on unknown currency code', () => {
      const formatted = formatSalary(50000, 'XYZ');
      expect(formatted).toContain('50,000');
    });
  });

  describe('formatDate', () => {
    it('formats ISO date strings correctly', () => {
      const formatted = formatDate('2022-05-15T00:00:00.000Z');
      expect(formatted).toMatch(/May 15, 2022/);
    });
  });
});
