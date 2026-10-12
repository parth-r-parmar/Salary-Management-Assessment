import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { InMemoryInsightsRepository } from '../src/repositories/InMemoryInsightsRepository';
import { InsightsService } from '../src/services/insightsService';
import { Employee } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

describe('Insights REST Endpoints', () => {
  let repository: InMemoryInsightsRepository;
  let service: InsightsService;
  let app: ReturnType<typeof createApp>;

  const mockData: Employee[] = [
    {
      id: '1',
      fullName: 'Emma Watson',
      email: 'emma@acme.org',
      jobTitle: 'Staff Engineer',
      department: 'Engineering',
      country: 'US',
      currency: 'USD',
      annualSalary: new Decimal(170000),
      employmentType: 'FULL_TIME',
      hireDate: new Date('2020-01-01'),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      fullName: 'Liam Smith',
      email: 'liam@acme.org',
      jobTitle: 'Software Engineer',
      department: 'Engineering',
      country: 'US',
      currency: 'USD',
      annualSalary: new Decimal(110000),
      employmentType: 'FULL_TIME',
      hireDate: new Date('2021-01-01'),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      fullName: 'Priya Sharma',
      email: 'priya@acme.org',
      jobTitle: 'Senior Product Manager',
      department: 'Product',
      country: 'IN',
      currency: 'INR',
      annualSalary: new Decimal(2400000),
      employmentType: 'FULL_TIME',
      hireDate: new Date('2022-01-01'),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    repository = new InMemoryInsightsRepository(mockData);
    service = new InsightsService(repository);
    app = createApp({ insightsService: service });
  });

  describe('GET /api/insights/summary', () => {
    it('returns 200 OK with headcount and payroll grouped strictly by currency', async () => {
      const res = await request(app).get('/api/insights/summary');
      expect(res.status).toBe(200);
      expect(res.body.data.totalHeadcount).toBe(3);
      expect(res.body.data.countryCount).toBe(2);
      expect(res.body.data.payrollByCurrency).toHaveLength(2);

      const usd = res.body.data.payrollByCurrency.find((p: { currency: string }) => p.currency === 'USD');
      expect(usd.totalPayroll).toBe(280000);
    });
  });

  describe('GET /api/insights/by-country', () => {
    it('returns 200 OK with country pay aggregations', async () => {
      const res = await request(app).get('/api/insights/by-country');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.data[0]).toHaveProperty('median');
      expect(res.body.data[0]).toHaveProperty('min');
      expect(res.body.data[0]).toHaveProperty('max');
    });
  });

  describe('GET /api/insights/by-department', () => {
    it('returns 200 OK filtered by country', async () => {
      const res = await request(app).get('/api/insights/by-department?country=US');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].groupKey).toBe('Engineering');
      expect(res.body.data[0].currency).toBe('USD');
    });
  });

  describe('GET /api/insights/by-job-title', () => {
    it('returns 200 OK filtered by country', async () => {
      const res = await request(app).get('/api/insights/by-job-title?country=US');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(2);
    });
  });

  describe('GET /api/insights/distribution', () => {
    it('returns 200 OK with salary bucket data when country is provided', async () => {
      const res = await request(app).get('/api/insights/distribution?country=US&bucketSize=50000');
      expect(res.status).toBe(200);
      expect(res.body.data.country).toBe('US');
      expect(res.body.data.currency).toBe('USD');
      expect(res.body.data.buckets).toBeInstanceOf(Array);
    });

    it('returns 400 VALIDATION_ERROR when country parameter is missing', async () => {
      const res = await request(app).get('/api/insights/distribution');
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('GET /api/insights/top-earners', () => {
    it('returns 200 OK with top earners in descending order', async () => {
      const res = await request(app).get('/api/insights/top-earners?limit=2&country=US');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.data[0].annualSalary).toBe(170000);
      expect(res.body.data[1].annualSalary).toBe(110000);
    });

    it('returns 400 VALIDATION_ERROR when limit exceeds 100', async () => {
      const res = await request(app).get('/api/insights/top-earners?limit=250');
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });
});
