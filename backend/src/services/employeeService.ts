import { Employee } from '@prisma/client';
import {
  IEmployeeRepository,
  EmployeeFilterQuery,
  PaginatedResult,
  CreateEmployeeInput,
  UpdateEmployeeInput,
} from '../repositories/IEmployeeRepository';
import { NotFoundError, ConflictError } from '../utils/errors';

export interface FormattedEmployee {
  id: string;
  fullName: string;
  email: string;
  jobTitle: string;
  department: string;
  country: string;
  currency: string;
  annualSalary: number;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT';
  hireDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class EmployeeService {
  constructor(private readonly repository: IEmployeeRepository) {}

  private formatEmployee(emp: Employee): FormattedEmployee {
    return {
      id: emp.id,
      fullName: emp.fullName,
      email: emp.email,
      jobTitle: emp.jobTitle,
      department: emp.department,
      country: emp.country,
      currency: emp.currency,
      annualSalary: Number(emp.annualSalary),
      employmentType: emp.employmentType as 'FULL_TIME' | 'PART_TIME' | 'CONTRACT',
      hireDate: emp.hireDate,
      createdAt: emp.createdAt,
      updatedAt: emp.updatedAt,
    };
  }

  async getEmployeeById(id: string): Promise<FormattedEmployee> {
    const emp = await this.repository.findById(id);
    if (!emp) {
      throw new NotFoundError(`Employee with ID '${id}' was not found`);
    }
    return this.formatEmployee(emp);
  }

  async listEmployees(query: EmployeeFilterQuery): Promise<PaginatedResult<FormattedEmployee>> {
    const result = await this.repository.findMany(query);
    return {
      data: result.data.map((e) => this.formatEmployee(e)),
      meta: result.meta,
    };
  }

  async createEmployee(input: CreateEmployeeInput): Promise<FormattedEmployee> {
    const existing = await this.repository.findByEmail(input.email);
    if (existing) {
      throw new ConflictError(`An employee with email '${input.email}' already exists`);
    }
    const created = await this.repository.create(input);
    return this.formatEmployee(created);
  }

  async updateEmployee(id: string, input: UpdateEmployeeInput): Promise<FormattedEmployee> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Employee with ID '${id}' was not found`);
    }

    if (input.email && input.email.toLowerCase() !== existing.email.toLowerCase()) {
      const emailConflict = await this.repository.findByEmail(input.email);
      if (emailConflict && emailConflict.id !== id) {
        throw new ConflictError(`An employee with email '${input.email}' already exists`);
      }
    }

    const updated = await this.repository.update(id, input);
    return this.formatEmployee(updated);
  }

  async deleteEmployee(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Employee with ID '${id}' was not found`);
    }
    await this.repository.delete(id);
  }

  async getFilterOptions(): Promise<{ countries: { code: string; currency: string }[]; departments: string[] }> {
    return this.repository.getDistinctFilters();
  }
}
