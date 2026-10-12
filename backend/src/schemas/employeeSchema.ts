import { z } from 'zod';

export const employmentTypeEnum = z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT']);

export const createEmployeeSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required').max(120),
  email: z.string().trim().email('Invalid email address').max(150),
  jobTitle: z.string().trim().min(1, 'Job title is required').max(100),
  department: z.string().trim().min(1, 'Department is required').max(80),
  country: z
    .string()
    .trim()
    .length(2, 'Country must be a 2-letter ISO code')
    .toUpperCase(),
  currency: z
    .string()
    .trim()
    .length(3, 'Currency must be a 3-letter ISO code')
    .toUpperCase(),
  annualSalary: z
    .number({ invalid_type_error: 'Salary must be a number' })
    .positive('Salary must be greater than 0'),
  employmentType: employmentTypeEnum,
  hireDate: z.coerce.date({ invalid_type_error: 'Invalid hire date' }),
});

export const updateEmployeeSchema = createEmployeeSchema.partial();

export const listEmployeesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
  search: z.string().trim().optional(),
  country: z.string().trim().length(2).toUpperCase().optional(),
  department: z.string().trim().optional(),
  sortBy: z
    .enum(['fullName', 'jobTitle', 'department', 'annualSalary', 'hireDate', 'createdAt'])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const employeeIdParamSchema = z.object({
  id: z.string().uuid('Invalid employee ID format'),
});

export type CreateEmployeeDto = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeDto = z.infer<typeof updateEmployeeSchema>;
export type ListEmployeesQueryDto = z.infer<typeof listEmployeesQuerySchema>;
