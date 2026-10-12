import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryInsightsRepository } from '../src/repositories/InMemoryInsightsRepository';
import { InsightsService } from '../src/services/insightsService';
import { Employee } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

describe('InsightsService', () => {
  let repository: InMemoryInsightsRepository;
  let service: InsightsService;

  const mockEmployees: Employee[] = [
    {
      id: '1',
      fullName: 'Alice US 1',
      email: 'alice1@acme.org',
      jobTitle: 'Software Engineer',
      department: 'Engineering',
      country: 'US',
      currency: 'USD',
      annualSalary: new Decimal(100000),
      employmentType: 'FULL_TIME',
      hireDate: new Date('2022-01-01'),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      fullName: 'Alice US 2',
      email: 'alice2@acme.org',
      jobTitle: 'Software Engineer',
      department: 'Engineering',
      country: 'US',
      currency: 'USD',
      annualSalary: new Decimal(120000),
      employmentType: 'FULL_TIME',
      hireDate: new Date('2022-01-01'),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      fullName: 'Alice US 3',
      email: 'alice3@acme.org',
      jobTitle: 'Engineering Manager',
      department: 'Engineering',
      country: 'US',
      currency: 'USD',
      annualSalary: new Decimal(160000),
      employmentType: 'FULL_TIME',
      hireDate: new Date('2022-01-01'),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '4',
      fullName: 'Bob IN 1',
      email: 'bob1@acme.org',
      jobTitle: 'Software Engineer',
      department: 'Engineering',
      country: 'IN',
      currency: 'INR',
      annualSalary: new Decimal(1000000),
      employmentType: 'FULL_TIME',
      hireDate: new Date('2022-01-01'),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '5',
      fullName: 'Bob IN 2',
      email: 'bob2@acme.org',
      jobTitle: 'Product Manager',
      department: 'Product',
      country: 'IN',
      currency: 'INR',
      annualSalary: new Decimal(2000000),
      employmentType: 'FULL_TIME',
      hireDate: new Date('2022-01-01'),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    repository = new InMemoryInsightsRepository(mockEmployees);
    service = new InsightsService(repository);
  });

  describe('getSummary', () => {
    it('returns org summary with distinct payroll totals per currency and no mixed currencies', async () => {
      const summary = await service.getSummary();
      expect(summary.totalHeadcount).toBe(5);
      expect(summary.countryCount).toBe(2);
      expect(summary.payrollByCurrency).toHaveLength(2);

      const usd = summary.payrollByCurrency.find((p) => p.currency === 'USD');
      expect(usd).toBeDefined();
      expect(usd!.headcount).toBe(3);
      expect(usd!.totalPayroll).toBe(380000);

      const inr = summary.payrollByCurrency.find((p) => p.currency === 'INR');
      expect(inr).toBeDefined();
      expect(inr!.headcount).toBe(2);
      expect(inr!.totalPayroll).toBe(3000000);
    });
  });

  describe('getByCountry', () => {
    it('aggregates compensation metrics per country with correct median and quartiles', async () => {
      const result = await service.getByCountry();
      expect(result).toHaveLength(2);

      const us = result.find((r) => r.groupKey === 'US');
      expect(us).toBeDefined();
      expect(us!.currency).toBe('USD');
      expect(us!.headcount).toBe(3);
      expect(us!.min).toBe(100000);
      expect(us!.median).toBe(120000);
      expect(us!.max).toBe(160000);
      expect(us!.avg).toBeCloseTo(126666.67, 1);
    });
  });

  describe('getByDepartment', () => {
    it('aggregates compensation metrics per department filtered by country', async () => {
      const result = await service.getByDepartment('US');
      expect(result).toHaveLength(1);
      expect(result[0].groupKey).toBe('Engineering');
      expect(result[0].currency).toBe('USD');
      expect(result[0].headcount).toBe(3);
    });
  });

  describe('getByJobTitle', () => {
    it('aggregates compensation metrics per job title filtered by country', async () => {
      const result = await service.getByJobTitle('US');
      expect(result).toHaveLength(2);
      const se = result.find((r) => r.groupKey === 'Software Engineer');
      expect(se).toBeDefined();
      expect(se!.headcount).toBe(2);
      expect(se!.min).toBe(100000);
      expect(se!.max).toBe(120000);
      expect(se!.median).toBe(110000);
    });
  });

  describe('getDistribution', () => {
    it('returns salary buckets for given country', async () => {
      const dist = await service.getDistribution('US', 50000);
      expect(dist.country).toBe('US');
      expect(dist.currency).toBe('USD');
      expect(dist.bucketSize).toBe(50000);
      expect(dist.buckets.length).toBeGreaterThan(0);
      const totalInBuckets = dist.buckets.reduce((acc, b) => acc + b.count, 0);
      expect(totalInBuckets).toBe(3);
    });
  });

  describe('getTopEarners', () => {
    it('returns top earners in descending order of compensation', async () => {
      const top = await service.getTopEarners(2, 'US');
      expect(top).toHaveLength(2);
      expect(top[0].fullName).toBe('Alice US 3');
      expect(top[0].annualSalary).toBe(160000);
      expect(top[1].fullName).toBe('Alice US 2');
      expect(top[1].annualSalary).toBe(120000);
    });
  });

  describe('JSON serialization safety', () => {
    it('serializes all analytical responses to JSON without BigInt errors', async () => {
      const summary = await service.getSummary();
      const byCountry = await service.getByCountry();
      const top = await service.getTopEarners(5);

      expect(() => JSON.stringify(summary)).not.toThrow();
      expect(() => JSON.stringify(byCountry)).not.toThrow();
      expect(() => JSON.stringify(top)).not.toThrow();
    });
  });
});
