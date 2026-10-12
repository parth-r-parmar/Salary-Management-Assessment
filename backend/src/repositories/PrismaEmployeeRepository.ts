import { PrismaClient, Employee, Prisma } from '@prisma/client';
import {
  IEmployeeRepository,
  EmployeeFilterQuery,
  PaginatedResult,
  CreateEmployeeInput,
  UpdateEmployeeInput,
} from './IEmployeeRepository';

export class PrismaEmployeeRepository implements IEmployeeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Employee | null> {
    return this.prisma.employee.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<Employee | null> {
    return this.prisma.employee.findUnique({
      where: { email },
    });
  }

  async findMany(query: EmployeeFilterQuery): Promise<PaginatedResult<Employee>> {
    const where: Prisma.EmployeeWhereInput = {};

    if (query.country) {
      where.country = query.country.toUpperCase();
    }

    if (query.department) {
      where.department = query.department;
    }

    if (query.search) {
      where.OR = [
        { fullName: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { jobTitle: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const page = query.page || 1;
    const pageSize = query.pageSize || 25;
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';

    const [totalCount, data] = await Promise.all([
      this.prisma.employee.count({ where }),
      this.prisma.employee.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize) || 1;

    return {
      data,
      meta: {
        page,
        pageSize,
        totalCount,
        totalPages,
      },
    };
  }

  async create(input: CreateEmployeeInput): Promise<Employee> {
    return this.prisma.employee.create({
      data: {
        fullName: input.fullName,
        email: input.email,
        jobTitle: input.jobTitle,
        department: input.department,
        country: input.country,
        currency: input.currency,
        annualSalary: input.annualSalary,
        employmentType: input.employmentType,
        hireDate: input.hireDate,
      },
    });
  }

  async update(id: string, input: UpdateEmployeeInput): Promise<Employee> {
    const data: Prisma.EmployeeUpdateInput = {};
    if (input.fullName !== undefined) data.fullName = input.fullName;
    if (input.email !== undefined) data.email = input.email;
    if (input.jobTitle !== undefined) data.jobTitle = input.jobTitle;
    if (input.department !== undefined) data.department = input.department;
    if (input.country !== undefined) data.country = input.country;
    if (input.currency !== undefined) data.currency = input.currency;
    if (input.annualSalary !== undefined) data.annualSalary = input.annualSalary;
    if (input.employmentType !== undefined) data.employmentType = input.employmentType;
    if (input.hireDate !== undefined) data.hireDate = input.hireDate;

    return this.prisma.employee.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.employee.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }

  async getDistinctFilters(): Promise<{ countries: { code: string; currency: string }[]; departments: string[] }> {
    const [countries, departments] = await Promise.all([
      this.prisma.employee.findMany({
        select: { country: true, currency: true },
        distinct: ['country', 'currency'],
        orderBy: { country: 'asc' },
      }),
      this.prisma.employee.findMany({
        select: { department: true },
        distinct: ['department'],
        orderBy: { department: 'asc' },
      }),
    ]);

    return {
      countries: countries.map((c) => ({ code: c.country, currency: c.currency })),
      departments: departments.map((d) => d.department),
    };
  }
}
