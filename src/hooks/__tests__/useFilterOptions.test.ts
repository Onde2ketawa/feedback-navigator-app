
import { renderHook, act, waitFor } from '@testing-library/react';
import { useFilterOptions } from '../useFilterOptions';
import { fetchChannels } from '@/api/filters/channelApi';
import { fetchYears } from '@/api/filters/yearApi';
import { fetchMonthsForYear } from '@/api/filters/monthApi';
import { supabase } from '@/integrations/supabase/client';

// Mock the API modules
jest.mock('@/api/filters/channelApi');
jest.mock('@/api/filters/yearApi');
jest.mock('@/api/filters/monthApi');

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
    
    // Default mock implementations
    (fetchChannels as jest.Mock).mockResolvedValue([
      { value: 'all', label: 'All Channels' }
    ]);
    (fetchYears as jest.Mock).mockResolvedValue(['all']);
    (fetchMonthsForYear as jest.Mock).mockResolvedValue([
      { value: 'all', label: 'All Months' }
    ]);
  });
  
  it('initializes with loading state and default arrays', () => {
    const { result } = renderHook(() => useFilterOptions());
    
    expect(result.current.isLoading).toBe(true);
    expect(result.current.availableChannels).toEqual([
      { value: 'all', label: 'All Channels' }
    ]);
    expect(result.current.availableYears).toEqual(['all']);
    expect(result.current.availableMonths).toEqual([
      { value: 'all', label: 'All Months' }
    ]);
    expect(result.current.error).toBe(null);
  });
  
  it('fetches channels and years on mount', async () => {
    // Mock the return values
    (fetchChannels as jest.Mock).mockResolvedValue([
      { value: 'all', label: 'All Channels' },
      { value: 'Channel 1', label: 'Channel 1' },
      { value: 'Channel 2', label: 'Channel 2' }
    ]);
    
    (fetchYears as jest.Mock).mockResolvedValue([
      'all', '2024', '2023'
    ]);
    
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
    (fetchChannels as jest.Mock).mockRejectedValue(new Error('Database error'));
    
    const { result } = renderHook(() => useFilterOptions());
    
    // Wait for the hook to update
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    
    expect(result.current.error).toBeTruthy();
    expect(result.current.error?.message).toBe('Database error');
  });
  
  it('fetches months for a specific year', async () => {
    // Mock the implementation for fetchMonthsForYear
    (fetchMonthsForYear as jest.Mock).mockResolvedValue([
      { value: 'all', label: 'All Months' },
      { value: '1', label: 'January' },
      { value: '2', label: 'February' }
    ]);
    
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
  
  it('handles errors when fetching months', async () => {
    // Mock an error when fetching months
    (fetchMonthsForYear as jest.Mock).mockRejectedValue(new Error('Month fetch error'));
    
    const { result } = renderHook(() => useFilterOptions());
    
    act(() => {
      result.current.fetchMonthsForYear('2024');
    });
    
    await waitFor(() => expect(result.current.isLoadingMonths).toBe(false));
    
    expect(result.current.monthsError).toBeTruthy();
    expect(result.current.monthsError?.message).toBe('Month fetch error');
    expect(result.current.availableMonths).toEqual([
      { value: 'all', label: 'All Months' }
    ]);
  });
});
