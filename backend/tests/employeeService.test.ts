import { describe, it, expect, beforeEach } from 'vitest';
import { EmployeeService } from '../src/services/employeeService';
import { InMemoryEmployeeRepository } from '../src/repositories/InMemoryEmployeeRepository';
import { NotFoundError, ConflictError } from '../src/utils/errors';

describe('EmployeeService', () => {
  let repository: InMemoryEmployeeRepository;
  let service: EmployeeService;

  beforeEach(() => {
    repository = new InMemoryEmployeeRepository();
    service = new EmployeeService(repository);
  });

  const sampleEmployeeInput = {
    fullName: 'Jane Smith',
    email: 'jane.smith@acme.org',
    jobTitle: 'Product Manager',
    department: 'Product',
    country: 'US',
    currency: 'USD',
    annualSalary: 110000,
    employmentType: 'FULL_TIME' as const,
    hireDate: new Date('2022-03-01'),
  };

  describe('createEmployee', () => {
    it('creates an employee and returns formatted employee with numeric salary', async () => {
      const created = await service.createEmployee(sampleEmployeeInput);
      expect(created).toBeDefined();
      expect(created.id).toBeDefined();
      expect(created.fullName).toBe('Jane Smith');
      expect(created.annualSalary).toBe(110000);
      expect(typeof created.annualSalary).toBe('number');
    });

    it('throws ConflictError when email already exists', async () => {
      await service.createEmployee(sampleEmployeeInput);
      await expect(service.createEmployee(sampleEmployeeInput)).rejects.toThrow(ConflictError);
    });
  });

  describe('getEmployeeById', () => {
    it('returns employee details when employee exists', async () => {
      const created = await service.createEmployee(sampleEmployeeInput);
      const found = await service.getEmployeeById(created.id);
      expect(found.id).toBe(created.id);
      expect(found.email).toBe(created.email);
    });

    it('throws NotFoundError when employee does not exist', async () => {
      await expect(service.getEmployeeById('non-existent-uuid')).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateEmployee', () => {
    it('updates employee fields successfully', async () => {
      const created = await service.createEmployee(sampleEmployeeInput);
      const updated = await service.updateEmployee(created.id, {
        annualSalary: 125000,
        jobTitle: 'Senior Product Manager',
      });
      expect(updated.annualSalary).toBe(125000);
      expect(updated.jobTitle).toBe('Senior Product Manager');
      expect(updated.fullName).toBe(created.fullName);
    });

    it('throws NotFoundError when updating non-existent employee', async () => {
      await expect(
        service.updateEmployee('non-existent-uuid', { jobTitle: 'Lead' })
      ).rejects.toThrow(NotFoundError);
    });

    it('throws ConflictError when updating email to an existing employee email', async () => {
      const emp1 = await service.createEmployee(sampleEmployeeInput);
      const emp2 = await service.createEmployee({
        ...sampleEmployeeInput,
        email: 'other.employee@acme.org',
      });

      await expect(
        service.updateEmployee(emp2.id, { email: emp1.email })
      ).rejects.toThrow(ConflictError);
    });
  });

  describe('deleteEmployee', () => {
    it('deletes an existing employee', async () => {
      const created = await service.createEmployee(sampleEmployeeInput);
      await service.deleteEmployee(created.id);
      await expect(service.getEmployeeById(created.id)).rejects.toThrow(NotFoundError);
    });

    it('throws NotFoundError when deleting non-existent employee', async () => {
      await expect(service.deleteEmployee('non-existent-uuid')).rejects.toThrow(NotFoundError);
    });
  });

  describe('listEmployees', () => {
    beforeEach(async () => {
      await service.createEmployee({
        ...sampleEmployeeInput,
        fullName: 'Alice Developer',
        email: 'alice@acme.org',
        department: 'Engineering',
        jobTitle: 'Software Engineer',
        country: 'US',
        annualSalary: 90000,
      });
      await service.createEmployee({
        ...sampleEmployeeInput,
        fullName: 'Bob Manager',
        email: 'bob@acme.org',
        department: 'Engineering',
        jobTitle: 'Engineering Manager',
        country: 'DE',
        annualSalary: 130000,
      });
      await service.createEmployee({
        ...sampleEmployeeInput,
        fullName: 'Charlie Designer',
        email: 'charlie@acme.org',
        department: 'Product',
        jobTitle: 'UI Designer',
        country: 'IN',
        annualSalary: 800000,
      });
    });

    it('returns paginated employees with correct metadata', async () => {
      const result = await service.listEmployees({ page: 1, pageSize: 2 });
      expect(result.data).toHaveLength(2);
      expect(result.meta.totalCount).toBe(3);
      expect(result.meta.totalPages).toBe(2);
      expect(result.meta.page).toBe(1);
    });

    it('filters by search keyword matching name or job title', async () => {
      const result = await service.listEmployees({ page: 1, pageSize: 10, search: 'Designer' });
      expect(result.data).toHaveLength(1);
      expect(result.data[0].fullName).toBe('Charlie Designer');
    });

    it('filters by department', async () => {
      const result = await service.listEmployees({ page: 1, pageSize: 10, department: 'Engineering' });
      expect(result.data).toHaveLength(2);
    });

    it('filters by country', async () => {
      const result = await service.listEmployees({ page: 1, pageSize: 10, country: 'IN' });
      expect(result.data).toHaveLength(1);
      expect(result.data[0].fullName).toBe('Charlie Designer');
    });

    it('sorts by annualSalary ascending and descending', async () => {
      const asc = await service.listEmployees({
        page: 1,
        pageSize: 10,
        sortBy: 'annualSalary',
        sortOrder: 'asc',
      });
      expect(asc.data[0].annualSalary).toBe(90000);

      const desc = await service.listEmployees({
        page: 1,
        pageSize: 10,
        sortBy: 'annualSalary',
        sortOrder: 'desc',
      });
      expect(desc.data[0].annualSalary).toBe(800000);
    });
  });
});
