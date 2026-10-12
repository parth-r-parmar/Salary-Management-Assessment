import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EmployeeFilters } from '../src/features/employees/EmployeeFilters';

describe('EmployeeFilters Component', () => {
  const dummyFilters = {
    countries: [{ code: 'US', currency: 'USD' }, { code: 'DE', currency: 'EUR' }],
    departments: ['Engineering', 'Product'],
  };

  it('renders search input and triggers onSearchChange', () => {
    const handleSearch = vi.fn();
    render(
      <EmployeeFilters
        search=""
        onSearchChange={handleSearch}
        country=""
        onCountryChange={vi.fn()}
        department=""
        onDepartmentChange={vi.fn()}
        onReset={vi.fn()}
        filterOptions={dummyFilters}
      />
    );

    const input = screen.getByPlaceholderText(/search by name, email, or job title/i);
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'Alice' } });
    expect(handleSearch).toHaveBeenCalledWith('Alice');
  });

  it('shows reset button when any filter is active and handles click', () => {
    const handleReset = vi.fn();
    render(
      <EmployeeFilters
        search="Software"
        onSearchChange={vi.fn()}
        country=""
        onCountryChange={vi.fn()}
        department=""
        onDepartmentChange={vi.fn()}
        onReset={handleReset}
        filterOptions={dummyFilters}
      />
    );

    const resetBtn = screen.getByRole('button', { name: /reset filters/i });
    expect(resetBtn).toBeInTheDocument();

    fireEvent.click(resetBtn);
    expect(handleReset).toHaveBeenCalledTimes(1);
  });
});
