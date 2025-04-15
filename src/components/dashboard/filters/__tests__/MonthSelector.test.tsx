
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MonthSelector } from '../MonthSelector';
import { MonthOption } from '@/hooks/useFilterOptions';

describe('MonthSelector Component', () => {
  const mockMonths: MonthOption[] = [
    { value: 'all', label: 'All Months' },
    { value: '1', label: 'January' },
    { value: '2', label: 'February' }
  ];
  const mockMonthChange = jest.fn();
  
  it('renders month selector with available options', () => {
    render(
      <MonthSelector
        availableMonths={mockMonths}
        selectedMonth="all"
        selectedYear="2024"
        onMonthChange={mockMonthChange}
      />
    );
    
    expect(screen.getByText('Month')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
  
  it('shows loading state when isLoading is true', () => {
    render(
      <MonthSelector
        availableMonths={mockMonths}
        selectedMonth="all"
        selectedYear="2024"
        onMonthChange={mockMonthChange}
        isLoading={true}
      />
    );
    
    expect(screen.getByText('Month')).toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });
  
  it('disables month selection when year is "all"', () => {
    render(
      <MonthSelector
        availableMonths={mockMonths}
        selectedMonth="all"
        selectedYear="all"
        onMonthChange={mockMonthChange}
      />
    );
    
    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toHaveAttribute('aria-disabled', 'true');
  });
});
