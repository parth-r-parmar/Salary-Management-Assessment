import { Employee } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import {
  IEmployeeRepository,
  EmployeeFilterQuery,
  PaginatedResult,
  CreateEmployeeInput,
  UpdateEmployeeInput,
} from './IEmployeeRepository';

export class InMemoryEmployeeRepository implements IEmployeeRepository {
  private employees: Employee[] = [];

  constructor(initialData: Employee[] = []) {
    this.employees = [...initialData];
  }

  async findById(id: string): Promise<Employee | null> {
    const emp = this.employees.find((e) => e.id === id);
    return emp ? { ...emp } : null;
  }

  async findByEmail(email: string): Promise<Employee | null> {
    const emp = this.employees.find((e) => e.email.toLowerCase() === email.toLowerCase());
    return emp ? { ...emp } : null;
  }

  async findMany(query: EmployeeFilterQuery): Promise<PaginatedResult<Employee>> {
    let result = [...this.employees];

    // Filter: search (name, email, job title)
    if (query.search) {
      const s = query.search.toLowerCase();
      result = result.filter(
        (e) =>
          e.fullName.toLowerCase().includes(s) ||
          e.email.toLowerCase().includes(s) ||
          e.jobTitle.toLowerCase().includes(s)
      );
    }

    // Filter: country
    if (query.country) {
      result = result.filter((e) => e.country.toUpperCase() === query.country!.toUpperCase());
    }

    // Filter: department
    if (query.department) {
      result = result.filter(
        (e) => e.department.toLowerCase() === query.department!.toLowerCase()
      );
    }

    // Sort
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';

    result.sort((a, b) => {
      let valA: unknown = a[sortBy as keyof Employee];
      let valB: unknown = b[sortBy as keyof Employee];

      if (sortBy === 'annualSalary') {
        valA = Number(a.annualSalary);
        valB = Number(b.annualSalary);
      }

      if (valA instanceof Date && valB instanceof Date) {
        return sortOrder === 'asc' ? valA.getTime() - valB.getTime() : valB.getTime() - valA.getTime();
      }

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }

      const strA = String(valA || '').toLowerCase();
      const strB = String(valB || '').toLowerCase();
      return sortOrder === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
    });

    // Pagination
    const totalCount = result.length;
    const page = query.page || 1;
    const pageSize = query.pageSize || 25;
    const totalPages = Math.ceil(totalCount / pageSize) || 1;
    const startIndex = (page - 1) * pageSize;
    const paginated = result.slice(startIndex, startIndex + pageSize);

    return {
      data: paginated.map((e) => ({ ...e })),
      meta: {
        page,
        pageSize,
        totalCount,
        totalPages,
      },
    };
  }

  async create(input: CreateEmployeeInput): Promise<Employee> {
    const now = new Date();
    const newEmp: Employee = {
      id: crypto.randomUUID(),
      fullName: input.fullName,
      email: input.email,
      jobTitle: input.jobTitle,
      department: input.department,
      country: input.country,
      currency: input.currency,
      annualSalary: new Decimal(input.annualSalary),
      employmentType: input.employmentType,
      hireDate: input.hireDate,
      createdAt: now,
      updatedAt: now,
    };
    this.employees.push(newEmp);
    return { ...newEmp };
  }

  async update(id: string, input: UpdateEmployeeInput): Promise<Employee> {
    const index = this.employees.findIndex((e) => e.id === id);
    if (index === -1) {
      throw new Error('Not found');
    }

    const current = this.employees[index];
    const updated: Employee = {
      ...current,
      ...input,
      annualSalary:
        input.annualSalary !== undefined
          ? new Decimal(input.annualSalary)
          : current.annualSalary,
      updatedAt: new Date(),
    };
    this.employees[index] = updated;
    return { ...updated };
  }

  async delete(id: string): Promise<boolean> {
    const index = this.employees.findIndex((e) => e.id === id);
    if (index === -1) {
      return false;
    }
    this.employees.splice(index, 1);
    return true;
  }

  async getDistinctFilters(): Promise<{ countries: { code: string; currency: string }[]; departments: string[] }> {
    const countryMap = new Map<string, string>();
    const departments = new Set<string>();

    for (const e of this.employees) {
      countryMap.set(e.country, e.currency);
      departments.add(e.department);
    }

    return {
      countries: Array.from(countryMap.entries()).map(([code, currency]) => ({ code, currency })),
      departments: Array.from(departments).sort(),
    };
  }

  // Helper for test setup
  public setEmployees(items: Employee[]): void {
    this.employees = [...items];
  }
}
