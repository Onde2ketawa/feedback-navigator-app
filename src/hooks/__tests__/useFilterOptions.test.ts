
import { renderHook, act, waitFor } from '@testing-library/react';
import { useFilterOptions } from '../useFilterOptions';
import { supabase } from '@/integrations/supabase/client';

// Mock the Supabase client
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    lt: jest.fn().mockReturnThis()
  }
}));

describe('useFilterOptions Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset the mock implementation before each test
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({
          data: [],
          error: null
        })
      })
    });
  });
  
  it('initializes with loading state and empty arrays', () => {
    const { result } = renderHook(() => useFilterOptions());
    
    expect(result.current.isLoading).toBe(true);
    expect(result.current.availableChannels).toEqual([]);
    expect(result.current.availableYears).toEqual([]);
    expect(result.current.availableMonths).toEqual([]);
    expect(result.current.error).toBe(null);
  });
  
  it('fetches channels and years on mount', async () => {
    // Mock the return value for channel query
    (supabase.from as jest.Mock).mockImplementation((tableName) => {
      if (tableName === 'channel') {
        return {
          select: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({
              data: [{ name: 'Channel 1' }, { name: 'Channel 2' }],
              error: null
            })
          })
        };
      } else if (tableName === 'customer_feedback') {
        return {
          select: jest.fn().mockResolvedValue({
            data: [{ submit_date: '2024-01-01' }, { submit_date: '2023-01-01' }],
            error: null
          })
        };
      }
      return {
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: [],
            error: null
          })
        })
      };
    });
    
    const { result } = renderHook(() => useFilterOptions());
    
    // Wait for the hook to update
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    
    expect(result.current.availableChannels).toEqual([
      { value: 'all', label: 'All Channels' },
      { value: 'Channel 1', label: 'Channel 1' },
      { value: 'Channel 2', label: 'Channel 2' }
    ]);
    
    expect(result.current.availableYears).toContain('all');
    expect(result.current.availableYears).toContain('2024');
    expect(result.current.availableYears).toContain('2023');
  });
  
  it('handles errors during data fetching', async () => {
    // Mock the channel query to return an error
    (supabase.from as jest.Mock).mockImplementation((tableName) => {
      if (tableName === 'channel') {
        return {
          select: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'Database error' }
            })
          })
        };
      }
      return {
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: [],
            error: null
          })
        })
      };
    });
    
    const { result } = renderHook(() => useFilterOptions());
    
    // Wait for the hook to update
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    
    expect(result.current.error).toBeTruthy();
    expect(result.current.error?.message).toContain('Failed to fetch channels');
  });
  
  it('fetches months for a specific year', async () => {
    // Mock the implementation for fetchMonthsForYear
    (supabase.from as jest.Mock).mockImplementation((tableName) => {
      if (tableName === 'customer_feedback') {
        return {
          select: jest.fn().mockReturnThis(),
          gte: jest.fn().mockReturnThis(),
          lt: jest.fn().mockResolvedValue({
            data: [
              { submit_date: '2024-01-15' },
              { submit_date: '2024-02-20' }
            ],
            error: null
          })
        };
      }
      return {
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: [],
            error: null
          })
        })
      };
    });
    
    const { result } = renderHook(() => useFilterOptions());
    
    act(() => {
      result.current.fetchMonthsForYear('2024');
    });
    
    await waitFor(() => expect(result.current.isLoadingMonths).toBe(false));
    
    expect(result.current.availableMonths).toEqual([
      { value: 'all', label: 'All Months' },
      { value: '1', label: 'January' },
      { value: '2', label: 'February' }
    ]);
  });
  
  it('sets all months when year is "all"', async () => {
    const { result } = renderHook(() => useFilterOptions());
    
    act(() => {
      result.current.fetchMonthsForYear('all');
    });
    
    expect(result.current.availableMonths).toEqual([
      { value: 'all', label: 'All Months' }
    ]);
  });
  
  it('handles errors when fetching months', async () => {
    // Mock an error when fetching months
    (supabase.from as jest.Mock).mockImplementation((tableName) => {
      if (tableName === 'customer_feedback') {
        return {
          select: jest.fn().mockReturnThis(),
          gte: jest.fn().mockReturnThis(),
          lt: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'Month fetch error' }
          })
        };
      }
      return {
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: [],
            error: null
          })
        })
      };
    });
    
    const { result } = renderHook(() => useFilterOptions());
    
    act(() => {
      result.current.fetchMonthsForYear('2024');
    });
    
    await waitFor(() => expect(result.current.isLoadingMonths).toBe(false));
    
    expect(result.current.monthsError).toBeTruthy();
    expect(result.current.monthsError?.message).toContain('Failed to fetch months');
    expect(result.current.availableMonths).toEqual([
      { value: 'all', label: 'All Months' }
    ]);
  });
});
