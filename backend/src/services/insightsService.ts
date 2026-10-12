import {
  IInsightsRepository,
  OrgSummary,
  AggregatedCompensation,
  SalaryDistribution,
  TopEarner,
} from '../repositories/IInsightsRepository';

export class InsightsService {
  constructor(private readonly repository: IInsightsRepository) {}

  async getSummary(): Promise<OrgSummary> {
    return this.repository.getSummary();
  }

  async getByCountry(): Promise<AggregatedCompensation[]> {
    return this.repository.getByCountry();
  }

  async getByDepartment(country?: string): Promise<AggregatedCompensation[]> {
    return this.repository.getByDepartment(country);
  }

  async getByJobTitle(country?: string): Promise<AggregatedCompensation[]> {
    return this.repository.getByJobTitle(country);
  }

  async getDistribution(country: string, bucketSize = 25000): Promise<SalaryDistribution> {
    const size = Math.max(1000, bucketSize);
    return this.repository.getDistribution(country, size);
  }

  async getTopEarners(limit = 10, country?: string): Promise<TopEarner[]> {
    const safeLimit = Math.min(100, Math.max(1, limit));
    return this.repository.getTopEarners(safeLimit, country);
  }
}
