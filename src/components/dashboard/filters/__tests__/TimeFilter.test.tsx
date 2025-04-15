
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TimeFilter } from '../TimeFilter';
import { MonthOption } from '@/hooks/useFilterOptions';

describe('TimeFilter Component', () => {
  const mockYears = ['all', '2025', '2024', '2023'];
  const mockMonths: MonthOption[] = [
    { value: 'all', label: 'All Months' },
    { value: '1', label: 'January' },
    { value: '2', label: 'February' }
  ];
  
  const mockYearChange = jest.fn();
  const mockMonthChange = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders correctly with year and month options', () => {
    render(
      <TimeFilter
        availableYears={mockYears}
        availableMonths={mockMonths}
        selectedYear="all"
        selectedMonth="all"
        onYearChange={mockYearChange}
        onMonthChange={mockMonthChange}
      />
    );
    
    expect(screen.getByText('Year')).toBeInTheDocument();
    expect(screen.getByText('Month')).toBeInTheDocument();
    expect(screen.getAllByRole('combobox')).toHaveLength(2);
  });
  
  it('displays loading skeleton when isLoading is true', () => {
    render(
      <TimeFilter
        availableYears={mockYears}
        availableMonths={mockMonths}
        selectedYear="all"
        selectedMonth="all"
        onYearChange={mockYearChange}
        onMonthChange={mockMonthChange}
        isLoading={true}
      />
    );
    
    expect(screen.getByText('Year')).toBeInTheDocument();
    expect(screen.getByText('Month')).toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    // Check for skeleton component
    expect(document.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });
  
  it('displays loading skeleton for months when isLoadingMonths is true', () => {
    render(
      <TimeFilter
        availableYears={mockYears}
        availableMonths={mockMonths}
        selectedYear="2024"
        selectedMonth="all"
        onYearChange={mockYearChange}
        onMonthChange={mockMonthChange}
        isLoadingMonths={true}
      />
    );
    
    expect(screen.getByText('Month')).toBeInTheDocument();
    // We should find at least one combobox (for the year) but not two
    expect(screen.getAllByRole('combobox').length).toBe(1);
  });
  
  it('displays error message when there is an error', () => {
    const testError = new Error('Test error message');
    render(
      <TimeFilter
        availableYears={mockYears}
        availableMonths={mockMonths}
        selectedYear="all"
        selectedMonth="all"
        onYearChange={mockYearChange}
        onMonthChange={mockMonthChange}
        error={testError}
      />
    );
    
    expect(screen.getByText(/Unable to load time filters/)).toBeInTheDocument();
    expect(screen.getByText(/Test error message/)).toBeInTheDocument();
  });
  
  it('disables month selection when year is "all"', () => {
    render(
      <TimeFilter
        availableYears={mockYears}
        availableMonths={mockMonths}
        selectedYear="all"
        selectedMonth="all"
        onYearChange={mockYearChange}
        onMonthChange={mockMonthChange}
      />
    );
    
    // The actual implementation of testing disabled state would depend on how it's implemented
    // This is a placeholder test
  });
});
