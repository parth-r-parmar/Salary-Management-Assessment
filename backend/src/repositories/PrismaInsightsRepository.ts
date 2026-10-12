import { PrismaClient, Prisma } from '@prisma/client';
import {
  IInsightsRepository,
  OrgSummary,
  AggregatedCompensation,
  SalaryDistribution,
  TopEarner,
} from './IInsightsRepository';

export class PrismaInsightsRepository implements IInsightsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getSummary(): Promise<OrgSummary> {
    const [totalHeadcount, countryRows, payrollRows] = await Promise.all([
      this.prisma.employee.count(),
      this.prisma.employee.findMany({
        select: { country: true },
        distinct: ['country'],
      }),
      this.prisma.$queryRaw<
        Array<{ currency: string; headcount: number; totalPayroll: number }>
      >(
        Prisma.sql`
          SELECT
            currency,
            CAST(COUNT(*) AS integer) AS headcount,
            CAST(ROUND(SUM(annual_salary), 2) AS double precision) AS "totalPayroll"
          FROM employees
          GROUP BY currency
          ORDER BY currency ASC
        `
      ),
    ]);

    return {
      totalHeadcount,
      countryCount: countryRows.length,
      payrollByCurrency: payrollRows.map((r) => ({
        currency: r.currency,
        headcount: Number(r.headcount),
        totalPayroll: Number(r.totalPayroll),
      })),
    };
  }

  async getByCountry(): Promise<AggregatedCompensation[]> {
    const rows = await this.prisma.$queryRaw<
      Array<{
        groupKey: string;
        currency: string;
        headcount: number;
        min: number;
        p25: number;
        median: number;
        p75: number;
        max: number;
        avg: number;
      }>
    >(
      Prisma.sql`
        SELECT
          country AS "groupKey",
          currency,
          CAST(COUNT(*) AS integer) AS headcount,
          CAST(MIN(annual_salary) AS double precision) AS min,
          CAST(percentile_cont(0.25) WITHIN GROUP (ORDER BY annual_salary) AS double precision) AS p25,
          CAST(percentile_cont(0.50) WITHIN GROUP (ORDER BY annual_salary) AS double precision) AS median,
          CAST(percentile_cont(0.75) WITHIN GROUP (ORDER BY annual_salary) AS double precision) AS p75,
          CAST(MAX(annual_salary) AS double precision) AS max,
          CAST(ROUND(AVG(annual_salary), 2) AS double precision) AS avg
        FROM employees
        GROUP BY country, currency
        ORDER BY country ASC
      `
    );

    return rows.map((r) => ({
      groupKey: r.groupKey,
      currency: r.currency,
      headcount: Number(r.headcount),
      min: Number(r.min),
      p25: Number(r.p25),
      median: Number(r.median),
      p75: Number(r.p75),
      max: Number(r.max),
      avg: Number(r.avg),
    }));
  }

  async getByDepartment(country?: string): Promise<AggregatedCompensation[]> {
    const whereClause = country
      ? Prisma.sql`WHERE country = ${country.toUpperCase()}`
      : Prisma.empty;

    const rows = await this.prisma.$queryRaw<
      Array<{
        groupKey: string;
        currency: string;
        headcount: number;
        min: number;
        p25: number;
        median: number;
        p75: number;
        max: number;
        avg: number;
      }>
    >(
      Prisma.sql`
        SELECT
          department AS "groupKey",
          currency,
          CAST(COUNT(*) AS integer) AS headcount,
          CAST(MIN(annual_salary) AS double precision) AS min,
          CAST(percentile_cont(0.25) WITHIN GROUP (ORDER BY annual_salary) AS double precision) AS p25,
          CAST(percentile_cont(0.50) WITHIN GROUP (ORDER BY annual_salary) AS double precision) AS median,
          CAST(percentile_cont(0.75) WITHIN GROUP (ORDER BY annual_salary) AS double precision) AS p75,
          CAST(MAX(annual_salary) AS double precision) AS max,
          CAST(ROUND(AVG(annual_salary), 2) AS double precision) AS avg
        FROM employees
        ${whereClause}
        GROUP BY department, currency
        ORDER BY department ASC
      `
    );

    return rows.map((r) => ({
      groupKey: r.groupKey,
      currency: r.currency,
      headcount: Number(r.headcount),
      min: Number(r.min),
      p25: Number(r.p25),
      median: Number(r.median),
      p75: Number(r.p75),
      max: Number(r.max),
      avg: Number(r.avg),
    }));
  }

  async getByJobTitle(country?: string): Promise<AggregatedCompensation[]> {
    const whereClause = country
      ? Prisma.sql`WHERE country = ${country.toUpperCase()}`
      : Prisma.empty;

    const rows = await this.prisma.$queryRaw<
      Array<{
        groupKey: string;
        currency: string;
        headcount: number;
        min: number;
        p25: number;
        median: number;
        p75: number;
        max: number;
        avg: number;
      }>
    >(
      Prisma.sql`
        SELECT
          job_title AS "groupKey",
          currency,
          CAST(COUNT(*) AS integer) AS headcount,
          CAST(MIN(annual_salary) AS double precision) AS min,
          CAST(percentile_cont(0.25) WITHIN GROUP (ORDER BY annual_salary) AS double precision) AS p25,
          CAST(percentile_cont(0.50) WITHIN GROUP (ORDER BY annual_salary) AS double precision) AS median,
          CAST(percentile_cont(0.75) WITHIN GROUP (ORDER BY annual_salary) AS double precision) AS p75,
          CAST(MAX(annual_salary) AS double precision) AS max,
          CAST(ROUND(AVG(annual_salary), 2) AS double precision) AS avg
        FROM employees
        ${whereClause}
        GROUP BY job_title, currency
        ORDER BY job_title ASC
      `
    );

    return rows.map((r) => ({
      groupKey: r.groupKey,
      currency: r.currency,
      headcount: Number(r.headcount),
      min: Number(r.min),
      p25: Number(r.p25),
      median: Number(r.median),
      p75: Number(r.p75),
      max: Number(r.max),
      avg: Number(r.avg),
    }));
  }

  async getDistribution(country: string, bucketSize = 25000): Promise<SalaryDistribution> {
    const countryUpper = country.toUpperCase();

    const [currencyRow, rows] = await Promise.all([
      this.prisma.employee.findFirst({
        where: { country: countryUpper },
        select: { currency: true },
      }),
      this.prisma.$queryRaw<
        Array<{ rangeStart: number; rangeEnd: number; count: number }>
      >(
        Prisma.sql`
          SELECT
            CAST(floor(annual_salary / ${bucketSize}) * ${bucketSize} AS double precision) AS "rangeStart",
            CAST((floor(annual_salary / ${bucketSize}) + 1) * ${bucketSize} AS double precision) AS "rangeEnd",
            CAST(COUNT(*) AS integer) AS count
          FROM employees
          WHERE country = ${countryUpper}
          GROUP BY "rangeStart", "rangeEnd"
          ORDER BY "rangeStart" ASC
        `
      ),
    ]);

    const currency = currencyRow?.currency || 'USD';

    return {
      country: countryUpper,
      currency,
      bucketSize,
      buckets: rows.map((r) => ({
        rangeStart: Number(r.rangeStart),
        rangeEnd: Number(r.rangeEnd),
        count: Number(r.count),
      })),
    };
  }

  async getTopEarners(limit = 10, country?: string): Promise<TopEarner[]> {
    const where = country ? { country: country.toUpperCase() } : {};
    const employees = await this.prisma.employee.findMany({
      where,
      orderBy: { annualSalary: 'desc' },
      take: limit,
    });

    return employees.map((e) => ({
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
