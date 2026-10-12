import { faker } from '@faker-js/faker';

export interface GeneratedEmployee {
  fullName: string;
  email: string;
  jobTitle: string;
  department: string;
  country: string;
  currency: string;
  annualSalary: number;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT';
  hireDate: Date;
}

export const COUNTRY_CURRENCY_MAP: Record<string, string> = {
  US: 'USD',
  IN: 'INR',
  GB: 'GBP',
  DE: 'EUR',
  CA: 'CAD',
  AU: 'AUD',
  SG: 'SGD',
  FR: 'EUR',
  AE: 'AED',
  BR: 'BRL',
};

interface CountryConfig {
  code: string;
  currency: string;
  baseMin: number;
  baseMax: number;
  weight: number;
}

const COUNTRIES: CountryConfig[] = [
  { code: 'US', currency: 'USD', baseMin: 55000, baseMax: 180000, weight: 25 },
  { code: 'IN', currency: 'INR', baseMin: 800000, baseMax: 3500000, weight: 22 },
  { code: 'GB', currency: 'GBP', baseMin: 45000, baseMax: 140000, weight: 12 },
  { code: 'DE', currency: 'EUR', baseMin: 50000, baseMax: 150000, weight: 10 },
  { code: 'CA', currency: 'CAD', baseMin: 65000, baseMax: 170000, weight: 8 },
  { code: 'AU', currency: 'AUD', baseMin: 70000, baseMax: 190000, weight: 6 },
  { code: 'SG', currency: 'SGD', baseMin: 65000, baseMax: 180000, weight: 6 },
  { code: 'FR', currency: 'EUR', baseMin: 45000, baseMax: 135000, weight: 5 },
  { code: 'AE', currency: 'AED', baseMin: 180000, baseMax: 550000, weight: 4 },
  { code: 'BR', currency: 'BRL', baseMin: 90000, baseMax: 320000, weight: 2 },
];

interface JobTitleConfig {
  title: string;
  seniorityMultiplier: number;
}

const DEPARTMENT_JOBS: Record<string, JobTitleConfig[]> = {
  Engineering: [
    { title: 'Junior Software Engineer', seniorityMultiplier: 0.8 },
    { title: 'Software Engineer', seniorityMultiplier: 1.0 },
    { title: 'Senior Software Engineer', seniorityMultiplier: 1.4 },
    { title: 'Staff Software Engineer', seniorityMultiplier: 1.8 },
    { title: 'Engineering Manager', seniorityMultiplier: 1.9 },
    { title: 'Director of Engineering', seniorityMultiplier: 2.4 },
    { title: 'QA Engineer', seniorityMultiplier: 0.9 },
    { title: 'DevOps Engineer', seniorityMultiplier: 1.2 },
  ],
  Product: [
    { title: 'Associate Product Manager', seniorityMultiplier: 0.85 },
    { title: 'Product Manager', seniorityMultiplier: 1.2 },
    { title: 'Senior Product Manager', seniorityMultiplier: 1.6 },
    { title: 'VP of Product', seniorityMultiplier: 2.5 },
    { title: 'UI/UX Designer', seniorityMultiplier: 1.0 },
    { title: 'Senior Product Designer', seniorityMultiplier: 1.4 },
  ],
  'Data & AI': [
    { title: 'Data Analyst', seniorityMultiplier: 0.9 },
    { title: 'Data Scientist', seniorityMultiplier: 1.3 },
    { title: 'Senior Data Scientist', seniorityMultiplier: 1.7 },
    { title: 'Machine Learning Engineer', seniorityMultiplier: 1.6 },
  ],
  Sales: [
    { title: 'Sales Development Representative', seniorityMultiplier: 0.75 },
    { title: 'Account Executive', seniorityMultiplier: 1.1 },
    { title: 'Senior Account Executive', seniorityMultiplier: 1.5 },
    { title: 'Sales Director', seniorityMultiplier: 2.2 },
  ],
  Marketing: [
    { title: 'Marketing Specialist', seniorityMultiplier: 0.85 },
    { title: 'Content Strategist', seniorityMultiplier: 0.95 },
    { title: 'Growth Marketing Manager', seniorityMultiplier: 1.3 },
    { title: 'Head of Marketing', seniorityMultiplier: 2.1 },
  ],
  'People & HR': [
    { title: 'HR Generalist', seniorityMultiplier: 0.85 },
    { title: 'Technical Recruiter', seniorityMultiplier: 0.95 },
    { title: 'People Operations Manager', seniorityMultiplier: 1.3 },
    { title: 'Chief People Officer', seniorityMultiplier: 2.6 },
  ],
  Finance: [
    { title: 'Financial Analyst', seniorityMultiplier: 0.95 },
    { title: 'Senior Accountant', seniorityMultiplier: 1.2 },
    { title: 'Finance Director', seniorityMultiplier: 2.3 },
  ],
  Legal: [
    { title: 'Corporate Counsel', seniorityMultiplier: 1.7 },
    { title: 'Senior Legal Counsel', seniorityMultiplier: 2.2 },
  ],
};

const DEPARTMENTS = Object.keys(DEPARTMENT_JOBS);
const EMPLOYMENT_TYPES: ('FULL_TIME' | 'PART_TIME' | 'CONTRACT')[] = [
  'FULL_TIME',
  'FULL_TIME',
  'FULL_TIME',
  'FULL_TIME',
  'FULL_TIME',
  'FULL_TIME',
  'FULL_TIME',
  'PART_TIME',
  'CONTRACT',
];

export function generateEmployees(count: number, seed = 42): GeneratedEmployee[] {
  faker.seed(seed);

  const employees: GeneratedEmployee[] = [];
  const usedEmails = new Set<string>();

  const weightedCountries: CountryConfig[] = [];
  for (const c of COUNTRIES) {
    for (let i = 0; i < c.weight; i++) {
      weightedCountries.push(c);
    }
  }

  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const fullName = `${firstName} ${lastName}`;

    // Guarantee unique email with sequence fallback
    let emailBase = `${firstName.toLowerCase().replace(/[^a-z0-9]/g, '')}.${lastName.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
    let email = `${emailBase}@acme.org`;
    let disambiguator = 1;
    while (usedEmails.has(email)) {
      email = `${emailBase}${disambiguator}@acme.org`;
      disambiguator++;
    }
    usedEmails.add(email);

    // Pick Country
    const countryCfg = weightedCountries[i % weightedCountries.length];

    // Pick Department & Job
    const dept = DEPARTMENTS[faker.number.int({ min: 0, max: DEPARTMENTS.length - 1 })];
    const jobs = DEPARTMENT_JOBS[dept];
    const jobCfg = jobs[faker.number.int({ min: 0, max: jobs.length - 1 })];

    // Calculate realistic salary
    const baseBandSpread = countryCfg.baseMax - countryCfg.baseMin;
    const baseSalary = countryCfg.baseMin + faker.number.float({ min: 0, max: baseBandSpread, fractionDigits: 2 });
    const annualSalary = Math.round((baseSalary * jobCfg.seniorityMultiplier) * 100) / 100;

    // Pick employment type
    const employmentType = EMPLOYMENT_TYPES[faker.number.int({ min: 0, max: EMPLOYMENT_TYPES.length - 1 })];

    // Hire date between 2018-01-01 and 2024-03-01
    const hireDate = faker.date.between({
      from: '2018-01-01T00:00:00.000Z',
      to: '2024-03-01T00:00:00.000Z',
    });

    employees.push({
      fullName,
      email,
      jobTitle: jobCfg.title,
      department: dept,
      country: countryCfg.code,
      currency: countryCfg.currency,
      annualSalary,
      employmentType,
      hireDate,
    });
  }

  return employees;
}
