import { Employee, EmploymentType } from '@prisma/client';

export interface EmployeeFilterQuery {
  page: number;
  pageSize: number;
  search?: string;
  country?: string;
  department?: string;
  sortBy?: 'fullName' | 'jobTitle' | 'department' | 'annualSalary' | 'hireDate' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

export interface CreateEmployeeInput {
  fullName: string;
  email: string;
  jobTitle: string;
  department: string;
  country: string;
  currency: string;
  annualSalary: number;
  employmentType: EmploymentType;
  hireDate: Date;
}

export interface UpdateEmployeeInput {
  fullName?: string;
  email?: string;
  jobTitle?: string;
  department?: string;
  country?: string;
  currency?: string;
  annualSalary?: number;
  employmentType?: EmploymentType;
  hireDate?: Date;
}

export interface IEmployeeRepository {
  findById(id: string): Promise<Employee | null>;
  findByEmail(email: string): Promise<Employee | null>;
  findMany(query: EmployeeFilterQuery): Promise<PaginatedResult<Employee>>;
  create(input: CreateEmployeeInput): Promise<Employee>;
  update(id: string, input: UpdateEmployeeInput): Promise<Employee>;
  delete(id: string): Promise<boolean>;
  getDistinctFilters(): Promise<{ countries: { code: string; currency: string }[]; departments: string[] }>;
}
