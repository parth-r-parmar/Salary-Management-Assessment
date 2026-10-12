import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CompensationTable } from '../src/features/insights/CompensationTable';
import { AggregatedCompensation } from '../src/types/api';

describe('CompensationTable Component', () => {
  const dummyData: AggregatedCompensation[] = [
    {
      groupKey: 'Engineering',
      currency: 'USD',
      headcount: 120,
      min: 65000,
      p25: 95000,
      median: 125000,
      p75: 165000,
      max: 220000,
      avg: 130000,
    },
  ];

  it('renders table columns, group key, and formatted salary values', () => {
    render(<CompensationTable data={dummyData} groupColumnName="Department" loading={false} />);

    expect(screen.getByText('Engineering')).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();
    expect(screen.getByText(/USD/)).toBeInTheDocument();
    expect(screen.getByText(/125,000/)).toBeInTheDocument(); // median
  });

  it('renders custom empty message when no data is provided', () => {
    render(
      <CompensationTable
        data={[]}
        groupColumnName="Department"
        loading={false}
        emptyMessage="No departments found."
      />
    );

    expect(screen.getByText('No departments found.')).toBeInTheDocument();
  });
});
