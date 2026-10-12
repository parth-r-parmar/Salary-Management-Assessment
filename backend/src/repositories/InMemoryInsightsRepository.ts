import { Employee } from '@prisma/client';
import {
  IInsightsRepository,
  OrgSummary,
  AggregatedCompensation,
  SalaryDistribution,
  TopEarner,
} from './IInsightsRepository';

export class InMemoryInsightsRepository implements IInsightsRepository {
  private employees: Employee[] = [];

  constructor(initialData: Employee[] = []) {
    this.employees = [...initialData];
  }

  public setEmployees(items: Employee[]): void {
    this.employees = [...items];
  }

  async getSummary(): Promise<OrgSummary> {
    const totalHeadcount = this.employees.length;
    const countries = new Set(this.employees.map((e) => e.country));

    const payrollMap = new Map<string, { headcount: number; totalPayroll: number }>();
    for (const e of this.employees) {
      const cur = e.currency;
      const salary = Number(e.annualSalary);
      const existing = payrollMap.get(cur) || { headcount: 0, totalPayroll: 0 };
      existing.headcount += 1;
      existing.totalPayroll += salary;
      payrollMap.set(cur, existing);
    }

    const payrollByCurrency = Array.from(payrollMap.entries()).map(([currency, val]) => ({
      currency,
      headcount: val.headcount,
      totalPayroll: Math.round(val.totalPayroll * 100) / 100,
    }));

    return {
      totalHeadcount,
      countryCount: countries.size,
      payrollByCurrency,
    };
  }

  private calculatePercentile(sorted: number[], p: number): number {
    if (sorted.length === 0) return 0;
    if (sorted.length === 1) return sorted[0];
    const index = p * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;
    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
  }

  private aggregateGroup(
    grouped: Map<string, { groupKey: string; currency: string; salaries: number[] }>
  ): AggregatedCompensation[] {
    const results: AggregatedCompensation[] = [];
    for (const item of grouped.values()) {
      const salaries = item.salaries.sort((a, b) => a - b);
      const count = salaries.length;
      if (count === 0) continue;

      const sum = salaries.reduce((acc, s) => acc + s, 0);
      const min = salaries[0];
      const max = salaries[count - 1];
      const avg = Math.round((sum / count) * 100) / 100;
      const p25 = Math.round(this.calculatePercentile(salaries, 0.25) * 100) / 100;
      const median = Math.round(this.calculatePercentile(salaries, 0.5) * 100) / 100;
      const p75 = Math.round(this.calculatePercentile(salaries, 0.75) * 100) / 100;

      results.push({
        groupKey: item.groupKey,
        currency: item.currency,
        headcount: count,
        min,
        p25,
        median,
        p75,
        max,
        avg,
      });
    }
    return results;
  }

  async getByCountry(): Promise<AggregatedCompensation[]> {
    const groups = new Map<string, { groupKey: string; currency: string; salaries: number[] }>();
    for (const e of this.employees) {
      const key = `${e.country}_${e.currency}`;
      if (!groups.has(key)) {
        groups.set(key, { groupKey: e.country, currency: e.currency, salaries: [] });
      }
      groups.get(key)!.salaries.push(Number(e.annualSalary));
    }
    return this.aggregateGroup(groups);
  }

  async getByDepartment(country?: string): Promise<AggregatedCompensation[]> {
    const filtered = country
      ? this.employees.filter((e) => e.country.toUpperCase() === country.toUpperCase())
      : this.employees;

    const groups = new Map<string, { groupKey: string; currency: string; salaries: number[] }>();
    for (const e of filtered) {
      const key = `${e.department}_${e.currency}`;
      if (!groups.has(key)) {
        groups.set(key, { groupKey: e.department, currency: e.currency, salaries: [] });
      }
      groups.get(key)!.salaries.push(Number(e.annualSalary));
    }
    return this.aggregateGroup(groups);
  }

  async getByJobTitle(country?: string): Promise<AggregatedCompensation[]> {
    const filtered = country
      ? this.employees.filter((e) => e.country.toUpperCase() === country.toUpperCase())
      : this.employees;

    const groups = new Map<string, { groupKey: string; currency: string; salaries: number[] }>();
    for (const e of filtered) {
      const key = `${e.jobTitle}_${e.currency}`;
      if (!groups.has(key)) {
        groups.set(key, { groupKey: e.jobTitle, currency: e.currency, salaries: [] });
      }
      groups.get(key)!.salaries.push(Number(e.annualSalary));
    }
    return this.aggregateGroup(groups);
  }

  async getDistribution(country: string, bucketSize = 25000): Promise<SalaryDistribution> {
    const filtered = this.employees.filter(
      (e) => e.country.toUpperCase() === country.toUpperCase()
    );
    const currency = filtered.length > 0 ? filtered[0].currency : 'USD';
    const salaries = filtered.map((e) => Number(e.annualSalary));

    if (salaries.length === 0) {
      return { country, currency, bucketSize, buckets: [] };
    }

    const min = Math.min(...salaries);
    const max = Math.max(...salaries);
    const startFloor = Math.floor(min / bucketSize) * bucketSize;
    const endCeil = Math.ceil(max / bucketSize) * bucketSize;

    const bucketCounts = new Map<number, number>();
    for (let r = startFloor; r < endCeil; r += bucketSize) {
      bucketCounts.set(r, 0);
    }

    for (const s of salaries) {
      const bIndex = Math.floor((s - startFloor) / bucketSize) * bucketSize + startFloor;
      bucketCounts.set(bIndex, (bucketCounts.get(bIndex) || 0) + 1);
    }

    const buckets = Array.from(bucketCounts.entries())
      .sort(([a], [b]) => a - b)
      .map(([rangeStart, count]) => ({
        rangeStart,
        rangeEnd: rangeStart + bucketSize,
        count,
      }));

    return {
      country,
      currency,
      bucketSize,
      buckets,
    };
  }

  async getTopEarners(limit = 10, country?: string): Promise<TopEarner[]> {
    const filtered = country
      ? this.employees.filter((e) => e.country.toUpperCase() === country.toUpperCase())
      : this.employees;

    const sorted = [...filtered].sort((a, b) => Number(b.annualSalary) - Number(a.annualSalary));
    return sorted.slice(0, limit).map((e) => ({
      id: e.id,
      fullName: e.fullName,
      jobTitle: e.jobTitle,
      department: e.department,
      country: e.country,
      currency: e.currency,
      annualSalary: Number(e.annualSalary),
    }));
  }
}
