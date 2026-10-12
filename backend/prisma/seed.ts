import { PrismaClient, EmploymentType } from '@prisma/client';
import { generateEmployees } from '../src/seed/generateEmployees';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Database Seeding (10,000 Employees) ---');
  const startTime = Date.now();

  // 1. Generate 10,000 deterministic records
  console.log('Generating 10,000 deterministic employee records...');
  const employees = generateEmployees(10000, 42);

  // 2. Clear existing records for idempotency
  console.log('Clearing existing employee records...');
  await prisma.employee.deleteMany();

  // 3. Insert in batches of 1000
  const batchSize = 1000;
  console.log(`Inserting 10,000 records in batches of ${batchSize}...`);

  for (let i = 0; i < employees.length; i += batchSize) {
    const chunk = employees.slice(i, i + batchSize).map((e) => ({
      fullName: e.fullName,
      email: e.email,
      jobTitle: e.jobTitle,
      department: e.department,
      country: e.country,
      currency: e.currency,
      annualSalary: e.annualSalary,
      employmentType: e.employmentType as EmploymentType,
      hireDate: e.hireDate,
    }));

    await prisma.employee.createMany({
      data: chunk,
      skipDuplicates: false,
    });
    console.log(`  Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(employees.length / batchSize)} (${i + chunk.length}/${employees.length})`);
  }

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);
  const totalCount = await prisma.employee.count();
  console.log(`Successfully seeded ${totalCount} employees in ${durationSec}s`);
}

main()
  .catch((e) => {
    console.error('Failed to seed database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
