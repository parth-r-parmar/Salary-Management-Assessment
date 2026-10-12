import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../src/App';

describe('App Smoke Test', () => {
  it('renders the application shell with navigation and title', () => {
    render(<App />);
    expect(screen.getByText('ACME Payroll Management')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /employees/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /insights/i })).toBeInTheDocument();
    expect(screen.getByText('Employee Salary Directory')).toBeInTheDocument();
  });
});
