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

export interface IInsightsRepository {
  getSummary(): Promise<OrgSummary>;
  getByCountry(): Promise<AggregatedCompensation[]>;
  getByDepartment(country?: string): Promise<AggregatedCompensation[]>;
  getByJobTitle(country?: string): Promise<AggregatedCompensation[]>;
  getDistribution(country: string, bucketSize?: number): Promise<SalaryDistribution>;
  getTopEarners(limit?: number, country?: string): Promise<TopEarner[]>;
}
