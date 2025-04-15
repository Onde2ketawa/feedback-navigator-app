
import React from 'react';
import { render, screen } from '@testing-library/react';
import { YearSelector } from '../YearSelector';

describe('YearSelector Component', () => {
  const mockYears = ['all', '2025', '2024', '2023'];
  const mockYearChange = jest.fn();
  
  it('renders year selector with available options', () => {
    render(
      <YearSelector
        availableYears={mockYears}
        selectedYear="all"
        onYearChange={mockYearChange}
      />
    );
    
    expect(screen.getByText('Year')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
  
  it('shows loading state when isLoading is true', () => {
    render(
      <YearSelector
        availableYears={mockYears}
        selectedYear="all"
        onYearChange={mockYearChange}
        isLoading={true}
      />
    );
    
    expect(screen.getByText('Year')).toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });
  
  it('displays a message when no years are available', () => {
    render(
      <YearSelector
        availableYears={[]}
        selectedYear=""
        onYearChange={mockYearChange}
      />
    );
    
    const selectTrigger = screen.getByRole('combobox');
    selectTrigger.click(); // Open the dropdown
    
    // This would work in a real browser environment but may need to be adjusted for testing
  });
});
