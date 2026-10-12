import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { InMemoryEmployeeRepository } from '../src/repositories/InMemoryEmployeeRepository';
import { EmployeeService } from '../src/services/employeeService';

describe('Employee REST Endpoints', () => {
  let repository: InMemoryEmployeeRepository;
  let service: EmployeeService;
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    repository = new InMemoryEmployeeRepository();
    service = new EmployeeService(repository);
    app = createApp({ employeeService: service });
  });

  const validPayload = {
    fullName: 'Robert Fox',
    email: 'robert.fox@acme.org',
    jobTitle: 'Senior DevOps Engineer',
    department: 'Engineering',
    country: 'US',
    currency: 'USD',
    annualSalary: 145000,
    employmentType: 'FULL_TIME',
    hireDate: '2021-08-10',
  };

  describe('POST /api/employees', () => {
    it('creates an employee with 201 Created', async () => {
      const res = await request(app).post('/api/employees').send(validPayload);
      expect(res.status).toBe(201);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.fullName).toBe('Robert Fox');
      expect(res.body.data.annualSalary).toBe(145000);
    });

    it('returns 400 VALIDATION_ERROR on invalid email or negative salary', async () => {
      const res = await request(app)
        .post('/api/employees')
        .send({ ...validPayload, email: 'bad-email', annualSalary: -1000 });
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(res.body.error.details.length).toBeGreaterThanOrEqual(1);
    });

    it('returns 409 CONFLICT on duplicate email address', async () => {
      await request(app).post('/api/employees').send(validPayload);
      const res = await request(app).post('/api/employees').send(validPayload);
      expect(res.status).toBe(409);
      expect(res.body.error.code).toBe('CONFLICT');
    });
  });

  describe('GET /api/employees', () => {
    it('returns paginated employees with 200 OK', async () => {
      await request(app).post('/api/employees').send(validPayload);
      const res = await request(app).get('/api/employees?page=1&pageSize=10');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.meta.totalCount).toBe(1);
      expect(res.body.meta.page).toBe(1);
    });

    it('returns 400 on pageSize > 100', async () => {
      const res = await request(app).get('/api/employees?pageSize=200');
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('GET /api/employees/:id', () => {
    it('returns 200 with employee data when employee exists', async () => {
      const createRes = await request(app).post('/api/employees').send(validPayload);
      const id = createRes.body.data.id;

      const res = await request(app).get(`/api/employees/${id}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(id);
    });

    it('returns 400 on non-UUID parameter', async () => {
      const res = await request(app).get('/api/employees/123-not-uuid');
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('returns 404 on non-existent UUID', async () => {
      const res = await request(app).get('/api/employees/550e8400-e29b-41d4-a716-446655440000');
      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('PUT /api/employees/:id', () => {
    it('returns 200 with updated employee data', async () => {
      const createRes = await request(app).post('/api/employees').send(validPayload);
      const id = createRes.body.data.id;

      const res = await request(app)
        .put(`/api/employees/${id}`)
        .send({ annualSalary: 160000, jobTitle: 'Staff DevOps Engineer' });

      expect(res.status).toBe(200);
      expect(res.body.data.annualSalary).toBe(160000);
      expect(res.body.data.jobTitle).toBe('Staff DevOps Engineer');
    });
  });

  describe('DELETE /api/employees/:id', () => {
    it('returns 204 No Content on successful deletion', async () => {
      const createRes = await request(app).post('/api/employees').send(validPayload);
      const id = createRes.body.data.id;

      const deleteRes = await request(app).delete(`/api/employees/${id}`);
      expect(deleteRes.status).toBe(204);

      const getRes = await request(app).get(`/api/employees/${id}`);
      expect(getRes.status).toBe(404);
    });
  });

  describe('GET /api/meta/filters', () => {
    it('returns filter options with 200 OK', async () => {
      await request(app).post('/api/employees').send(validPayload);
      const res = await request(app).get('/api/meta/filters');
      expect(res.status).toBe(200);
      expect(res.body.data.countries).toBeDefined();
      expect(res.body.data.departments).toBeDefined();
      expect(res.body.data.departments).toContain('Engineering');
    });
  });
});
