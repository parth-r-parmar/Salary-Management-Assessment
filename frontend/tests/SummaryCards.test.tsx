import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SummaryCards } from '../src/features/insights/SummaryCards';
import { OrgSummary } from '../src/types/api';

describe('SummaryCards Component', () => {
  const dummySummary: OrgSummary = {
    totalHeadcount: 10000,
    countryCount: 8,
    payrollByCurrency: [
      { currency: 'USD', headcount: 2500, totalPayroll: 312500000 },
      { currency: 'INR', headcount: 2200, totalPayroll: 4840000000 },
    ],
  };

  it('renders headcount, country count, and payroll chips grouped per currency', () => {
    render(<SummaryCards summary={dummySummary} loading={false} />);

    expect(screen.getByText('10,000')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText(/USD:/)).toBeInTheDocument();
    expect(screen.getByText(/INR:/)).toBeInTheDocument();
  });
});
