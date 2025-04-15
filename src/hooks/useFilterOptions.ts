
import { useState, useEffect, useCallback } from 'react';
import { fetchChannels } from '@/api/filters/channelApi';
import { fetchYears } from '@/api/filters/yearApi';
import { fetchMonthsForYear as fetchMonthsApi } from '@/api/filters/monthApi';

export interface ChannelOption {
  value: string;
  label: string;
}

export interface MonthOption {
  value: string;
  label: string;
}

/**
 * Custom hook that provides filtering options for feedback data
 */
export function useFilterOptions() {
  // State definitions
  const [availableChannels, setAvailableChannels] = useState<ChannelOption[]>([
    { value: 'all', label: 'All Channels' }
  ]);
  const [availableYears, setAvailableYears] = useState<string[]>(['all']);
  const [availableMonths, setAvailableMonths] = useState<MonthOption[]>([
    { value: 'all', label: 'All Months' }
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMonths, setIsLoadingMonths] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [monthsError, setMonthsError] = useState<Error | null>(null);

  // Load initial filter options
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch channels and years in parallel for better performance
        const [channelsResult, yearsResult] = await Promise.all([
          fetchChannels(),
          fetchYears()
        ]);
        
        setAvailableChannels(channelsResult);
        setAvailableYears(yearsResult);
      } catch (err) {
        console.error('Error in loadFilterOptions:', err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    loadFilterOptions();
  }, []);

  // Memoized function to fetch months for a specific year
  const fetchMonthsForYear = useCallback(async (selectedYear: string) => {
    try {
      setIsLoadingMonths(true);
      setMonthsError(null);

      const monthOptions = await fetchMonthsApi(selectedYear);
      setAvailableMonths(monthOptions);
    } catch (err) {
      console.error('Error in fetchMonths:', err);
      setMonthsError(err instanceof Error ? err : new Error('An unknown error occurred'));
      setAvailableMonths([{ value: 'all', label: 'All Months' }]);
    } finally {
      setIsLoadingMonths(false);
    }
  }, []);

  return {
    availableChannels,
    availableYears,
    availableMonths,
    isLoading,
    isLoadingMonths,
    error,
    monthsError,
    fetchMonthsForYear
  };
}
