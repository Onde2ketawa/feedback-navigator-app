
import { renderHook, act } from '@testing-library/react';
import { useFeedbackFilters } from '../useFeedbackFilters';
import { useToast } from '@/hooks/use-toast';

// Mock the useToast hook
jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn()
}));

describe('useFeedbackFilters Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock implementation for useToast
    (useToast as jest.Mock).mockReturnValue({
      toast: jest.fn()
    });
  });
  
  it('initializes with default values', () => {
    const { result } = renderHook(() => useFeedbackFilters());
    
    expect(result.current.selectedChannel).toBe('all');
    expect(result.current.selectedYear).toBe('all'); // Now correctly set to 'all' instead of '2024'
    expect(result.current.selectedMonth).toBe('all');
    expect(result.current.ratingRange).toEqual([1, 5]);
    expect(result.current.isApplyingFilters).toBe(false);
  });
  
  it('updates channel when handleChannelChange is called', () => {
    const { result } = renderHook(() => useFeedbackFilters());
    
    act(() => {
      result.current.handleChannelChange('channel1');
    });
    
    expect(result.current.selectedChannel).toBe('channel1');
  });
  
  it('updates year and resets month when handleYearChange is called', () => {
    const { result } = renderHook(() => useFeedbackFilters());
    
    // First set month to something else
    act(() => {
      result.current.handleMonthChange('6');
    });
    
    // Then change the year
    act(() => {
      result.current.handleYearChange('2025');
    });
    
    expect(result.current.selectedYear).toBe('2025');
    expect(result.current.selectedMonth).toBe('all'); // Month should be reset
  });
  
  it('resets time filters when handleResetTimeFilters is called', () => {
    const mockToast = jest.fn();
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
    
    const { result } = renderHook(() => useFeedbackFilters());
    
    // First set values to non-default
    act(() => {
      result.current.handleYearChange('2025');
      result.current.handleMonthChange('6');
    });
    
    // Then reset
    act(() => {
      result.current.handleResetTimeFilters();
    });
    
    expect(result.current.selectedYear).toBe('all'); // Now correctly reset to 'all'
    expect(result.current.selectedMonth).toBe('all');
    expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
      title: "Date filters reset"
    }));
  });
  
  it('applies filters correctly', () => {
    jest.useFakeTimers();
    const mockToast = jest.fn();
    const mockFilterChange = jest.fn();
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
    
    const { result } = renderHook(() => useFeedbackFilters());
    
    // Set some filter values
    act(() => {
      result.current.handleChannelChange('channel1');
      result.current.handleYearChange('2024');
      result.current.setRatingRange([2, 4]);
    });
    
    // Apply filters
    act(() => {
      result.current.applyFilters(mockFilterChange);
    });
    
    // Check that isApplyingFilters is set to true
    expect(result.current.isApplyingFilters).toBe(true);
    
    // Fast-forward timers to complete setTimeout
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    // Check that the filter change function was called with correct params
    expect(mockFilterChange).toHaveBeenCalledWith({
      channel: 'channel1',
      year: '2024',
      month: null,
      ratingMin: 2,
      ratingMax: 4
    });
    
    // Check that isApplyingFilters is reset
    expect(result.current.isApplyingFilters).toBe(false);
    
    // Check that toast was shown
    expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
      title: "Filters Applied"
    }));
    
    jest.useRealTimers();
  });
});
