-- CreateEnum
CREATE TYPE "employment_type" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT');

-- CreateTable
CREATE TABLE "employees" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "full_name" VARCHAR(120) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "job_title" VARCHAR(100) NOT NULL,
    "department" VARCHAR(80) NOT NULL,
    "country" CHAR(2) NOT NULL,
    "currency" CHAR(3) NOT NULL,
    "annual_salary" DECIMAL(12,2) NOT NULL,
    "employment_type" "employment_type" NOT NULL,
    "hire_date" DATE NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "employees_email_key" ON "employees"("email");

-- CreateIndex
CREATE INDEX "idx_employees_country_currency" ON "employees"("country", "currency");

-- CreateIndex
CREATE INDEX "idx_employees_department_currency" ON "employees"("department", "currency");

-- CreateIndex
CREATE INDEX "idx_employees_job_title_currency" ON "employees"("job_title", "currency");

-- CreateIndex
CREATE INDEX "idx_employees_annual_salary" ON "employees"("annual_salary");

-- CreateIndex
CREATE INDEX "idx_employees_hire_date" ON "employees"("hire_date");
