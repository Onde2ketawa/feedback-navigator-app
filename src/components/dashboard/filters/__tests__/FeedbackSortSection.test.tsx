
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FeedbackSortSection } from '../../FeedbackSortSection';
import { useFilterOptions } from '@/hooks/useFilterOptions';
import { useFeedbackFilters } from '../useFeedbackFilters';

// Mock the hooks
jest.mock('@/hooks/useFilterOptions', () => ({
  useFilterOptions: jest.fn()
}));

jest.mock('../useFeedbackFilters', () => ({
  useFeedbackFilters: jest.fn()
}));

describe('FeedbackSortSection Component', () => {
  const mockOnFilterChange = jest.fn();
  const mockFetchMonthsForYear = jest.fn();
  const mockApplyFilters = jest.fn();
  const mockHandleYearChange = jest.fn();
  
  const mockCategories = [
    { id: 'cat1', name: 'Category 1' },
    { id: 'cat2', name: 'Category 2' }
  ];
  
  const mockSubcategories = [
    { id: 'subcat1', name: 'Subcategory 1', category_id: 'cat1' },
    { id: 'subcat2', name: 'Subcategory 2', category_id: 'cat2' }
  ];
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock implementation of useFilterOptions
    (useFilterOptions as jest.Mock).mockReturnValue({
      availableChannels: [
        { value: 'all', label: 'All Channels' },
        { value: 'channel1', label: 'Channel 1' }
      ],
      availableYears: ['all', '2024', '2023'],
      availableMonths: [
        { value: 'all', label: 'All Months' },
        { value: '1', label: 'January' }
      ],
      isLoading: false,
      isLoadingMonths: false,
      error: null,
      monthsError: null,
      fetchMonthsForYear: mockFetchMonthsForYear
    });
    
    // Mock implementation of useFeedbackFilters
    (useFeedbackFilters as jest.Mock).mockReturnValue({
      selectedChannel: 'all',
      selectedYear: 'all',
      selectedMonth: 'all',
      selectedCategory: 'all',
      selectedSubcategory: 'all',
      ratingRange: [1, 5],
      handleChannelChange: jest.fn(),
      handleYearChange: mockHandleYearChange,
      handleMonthChange: jest.fn(),
      handleCategoryChange: jest.fn(),
      handleSubcategoryChange: jest.fn(),
      setRatingRange: jest.fn(),
      applyFilters: mockApplyFilters
    });
  });
  
  it('renders all filter components', () => {
    render(
      <FeedbackSortSection 
        onFilterChange={mockOnFilterChange} 
        categories={mockCategories}
        subcategories={mockSubcategories}
      />
    );
    
    expect(screen.getByText('Channel')).toBeInTheDocument();
    expect(screen.getByText('Year')).toBeInTheDocument();
    expect(screen.getByText('Month')).toBeInTheDocument();
    expect(screen.getByText('Rating')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Sub Category')).toBeInTheDocument();
    expect(screen.getByText('Apply Filters')).toBeInTheDocument();
  });
  
  it('shows loading skeleton when isLoading is true', () => {
    (useFilterOptions as jest.Mock).mockReturnValue({
      availableChannels: [],
      availableYears: [],
      availableMonths: [],
      isLoading: true,
      isLoadingMonths: false,
      error: null,
      monthsError: null,
      fetchMonthsForYear: mockFetchMonthsForYear
    });
    
    render(
      <FeedbackSortSection 
        onFilterChange={mockOnFilterChange}
        categories={mockCategories}
        subcategories={mockSubcategories}
      />
    );
    
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });
  
  it('shows error alert when there is a critical error', () => {
    (useFilterOptions as jest.Mock).mockReturnValue({
      availableChannels: [],
      availableYears: [],
      availableMonths: [],
      isLoading: false,
      isLoadingMonths: false,
      error: new Error('Critical error'),
      monthsError: null,
      fetchMonthsForYear: mockFetchMonthsForYear
    });
    
    render(
      <FeedbackSortSection 
        onFilterChange={mockOnFilterChange}
        categories={mockCategories}
        subcategories={mockSubcategories}
      />
    );
    
    expect(screen.getByText(/Error loading filters/)).toBeInTheDocument();
    expect(screen.getByText(/Critical error/)).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });
  
  it('applies filters when Apply Filters button is clicked', async () => {
    render(
      <FeedbackSortSection 
        onFilterChange={mockOnFilterChange}
        categories={mockCategories}
        subcategories={mockSubcategories}
      />
    );
    
    const applyButton = screen.getByText('Apply Filters');
    fireEvent.click(applyButton);
    
    expect(mockApplyFilters).toHaveBeenCalledWith(mockOnFilterChange);
  });
  
  it('fetches months when year changes', async () => {
    // Mock the useEffect for selectedYear
    const mockUseEffect = jest.spyOn(React, 'useEffect');
    
    render(
      <FeedbackSortSection 
        onFilterChange={mockOnFilterChange}
        categories={mockCategories}
        subcategories={mockSubcategories}
      />
    );
    
    // Simulate year change by triggering the effect manually
    const yearChangeEffect = mockUseEffect.mock.calls.find(
      call => call[1]?.toString().includes('selectedYear')
    )?.[0];
    
    // Update the selected year
    (useFeedbackFilters as jest.Mock).mockReturnValue({
      selectedChannel: 'all',
      selectedYear: '2024', // Changed from 'all' to '2024'
      selectedMonth: 'all',
      selectedCategory: 'all',
      selectedSubcategory: 'all',
      ratingRange: [1, 5],
      handleChannelChange: jest.fn(),
      handleYearChange: mockHandleYearChange,
      handleMonthChange: jest.fn(),
      handleCategoryChange: jest.fn(),
      handleSubcategoryChange: jest.fn(),
      setRatingRange: jest.fn(),
      applyFilters: mockApplyFilters
    });
    
    if (yearChangeEffect) {
      yearChangeEffect();
    }
    
    expect(mockFetchMonthsForYear).toHaveBeenCalledWith('2024');
  });
});
