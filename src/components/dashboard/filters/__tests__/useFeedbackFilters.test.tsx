
import { renderHook, act } from '@testing-library/react';
import { useFeedbackFilters } from '../useFeedbackFilters';

describe('useFeedbackFilters Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('initializes with default values', () => {
    const { result } = renderHook(() => useFeedbackFilters());
    
    expect(result.current.selectedChannel).toBe('all');
    expect(result.current.selectedYear).toBe('all');
    expect(result.current.selectedMonth).toBe('all');
    expect(result.current.selectedCategory).toBe('all');
    expect(result.current.selectedSubcategory).toBe('all');
    expect(result.current.ratingRange).toEqual([1, 5]);
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
  
  it('updates category and resets subcategory when handleCategoryChange is called', () => {
    const { result } = renderHook(() => useFeedbackFilters());
    
    // First set subcategory to something else
    act(() => {
      result.current.handleSubcategoryChange('subcat1');
    });
    
    // Then change the category
    act(() => {
      result.current.handleCategoryChange('cat1');
    });
    
    expect(result.current.selectedCategory).toBe('cat1');
    expect(result.current.selectedSubcategory).toBe('all'); // Subcategory should be reset
  });
  
  it('applies filters correctly', () => {
    const mockFilterChange = jest.fn();
    
    const { result } = renderHook(() => useFeedbackFilters());
    
    // Set some filter values
    act(() => {
      result.current.handleChannelChange('channel1');
      result.current.handleYearChange('2024');
      result.current.handleCategoryChange('cat1');
      result.current.setRatingRange([2, 4]);
    });
    
    // Apply filters
    act(() => {
      result.current.applyFilters(mockFilterChange);
    });
    
    // Check that the filter change function was called with correct params
    expect(mockFilterChange).toHaveBeenCalledWith({
      channel: 'channel1',
      year: '2024',
      month: null,
      category: 'cat1',
      subcategory: null,
      ratingMin: 2,
      ratingMax: 4
    });
  });
});
