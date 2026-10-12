export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT';

export interface Employee {
  id: string;
  fullName: string;
  email: string;
  jobTitle: string;
  department: string;
  country: string;
  currency: string;
  annualSalary: number;
  employmentType: EmploymentType;
  hireDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface PaginatedEmployeesResponse {
  data: Employee[];
  meta: PaginationMeta;
}

export interface CreateEmployeePayload {
  fullName: string;
  email: string;
  jobTitle: string;
  department: string;
  country: string;
  currency: string;
  annualSalary: number;
  employmentType: EmploymentType;
  hireDate: string;
}

export type UpdateEmployeePayload = Partial<CreateEmployeePayload>;

export interface FilterOptions {
  countries: { code: string; currency: string }[];
  departments: string[];
}

export interface CurrencyPayroll {
  currency: string;
  headcount: number;
  totalPayroll: number;
}

export interface OrgSummary {
  totalHeadcount: number;
  countryCount: number;
  payrollByCurrency: CurrencyPayroll[];
}

export interface AggregatedCompensation {
  groupKey: string;
  currency: string;
  headcount: number;
  min: number;
  p25: number;
  median: number;
  p75: number;
  max: number;
  avg: number;
}

export interface SalaryBucket {
  rangeStart: number;
  rangeEnd: number;
  count: number;
}

export interface SalaryDistribution {
  country: string;
  currency: string;
  bucketSize: number;
  buckets: SalaryBucket[];
}

export interface TopEarner {
  id: string;
  fullName: string;
  jobTitle: string;
  department: string;
  country: string;
  currency: string;
  annualSalary: number;
}
