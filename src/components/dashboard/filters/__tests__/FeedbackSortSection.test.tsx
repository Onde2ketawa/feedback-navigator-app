
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FeedbackSortSection } from '../../FeedbackSortSection';
import { useFilterOptions } from '@/hooks/useFilterOptions';

// Mock the useFilterOptions hook
jest.mock('@/hooks/useFilterOptions', () => ({
  useFilterOptions: jest.fn()
}));

describe('FeedbackSortSection Component', () => {
  const mockOnFilterChange = jest.fn();
  const mockFetchMonthsForYear = jest.fn();
  
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
  });
  
  it('renders all filter components', () => {
    render(<FeedbackSortSection onFilterChange={mockOnFilterChange} />);
    
    expect(screen.getByText('Filter Feedback')).toBeInTheDocument();
    expect(screen.getByText('Channel')).toBeInTheDocument();
    expect(screen.getByText('Year')).toBeInTheDocument();
    expect(screen.getByText('Month')).toBeInTheDocument();
    expect(screen.getByText(/Rating:/)).toBeInTheDocument();
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
    
    render(<FeedbackSortSection onFilterChange={mockOnFilterChange} />);
    
    expect(screen.getByText('Filter Feedback')).toBeInTheDocument();
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
    
    render(<FeedbackSortSection onFilterChange={mockOnFilterChange} />);
    
    expect(screen.getByText(/Error loading filters/)).toBeInTheDocument();
    expect(screen.getByText(/Critical error/)).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });
  
  it('applies filters when Apply Filters button is clicked', async () => {
    render(<FeedbackSortSection onFilterChange={mockOnFilterChange} />);
    
    fireEvent.click(screen.getByText('Apply Filters'));
    
    // Wait for the mock function to be called after the timeout
    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith({
        channel: null,
        year: null,
        month: null,
        ratingMin: 1,
        ratingMax: 5
      });
    });
  });
  
  it('fetches months when year changes', () => {
    render(<FeedbackSortSection onFilterChange={mockOnFilterChange} />);
    
    // Open year dropdown and select a year (this is simplified)
    // In a real test with Radix UI, this would be more complex
    const yearSelect = screen.getAllByRole('combobox')[1]; // Assuming year is the second select
    fireEvent.change(yearSelect, { target: { value: '2024' } });
    
    expect(mockFetchMonthsForYear).toHaveBeenCalledWith('2024');
  });
});
