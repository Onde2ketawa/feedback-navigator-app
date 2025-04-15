
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ChannelOption {
  value: string;
  label: string;
}

export interface MonthOption {
  value: string;
  label: string;
}

/**
 * Fetches unique channels from the database
 */
const fetchChannels = async (): Promise<ChannelOption[]> => {
  try {
    const { data, error } = await supabase
      .from('channel')
      .select('name')
      .order('name');
    
    if (error) {
      console.error('Error fetching channels:', error);
      throw new Error(`Failed to fetch channels: ${error.message}`);
    }
    
    return [
      { value: 'all', label: 'All Channels' },
      ...(data?.map(c => ({ value: c.name, label: c.name })) || [])
    ];
  } catch (err) {
    console.error('Error in fetchChannels:', err);
    throw err;
  }
};

/**
 * Fetches unique years from feedback submissions
 */
const fetchYears = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('customer_feedback')
      .select('submit_date')
      .not('submit_date', 'is', null);
      
    if (error) {
      console.error('Error fetching years:', error);
      throw new Error(`Failed to fetch years: ${error.message}`);
    }

    if (data && data.length > 0) {
      // Extract years from submit_date and filter out null values
      const years = data
        .filter(item => item.submit_date) 
        .map(item => new Date(item.submit_date).getFullYear().toString());
      
      // Get unique years and sort them in descending order
      const uniqueYears = Array.from(new Set(years))
        .sort((a, b) => parseInt(b) - parseInt(a)); // Latest year first
      
      console.log('Years extracted from query:', uniqueYears);
      return ['all', ...uniqueYears];
    }
    
    console.log('No year data found in query');
    return ['all'];
  } catch (err) {
    console.error('Error in fetchYears:', err);
    throw err;
  }
};

/**
 * Fetches months for a specific year
 */
const fetchMonthsForYear = async (selectedYear: string): Promise<MonthOption[]> => {
  // Return default for "all years" selection
  if (selectedYear === 'all') {
    return [{ value: 'all', label: 'All Months' }];
  }

  try {
    const { data, error } = await supabase
      .from('customer_feedback')
      .select('submit_date')
      .not('submit_date', 'is', null)
      .gte('submit_date', `${selectedYear}-01-01`)
      .lt('submit_date', `${parseInt(selectedYear) + 1}-01-01`);
    
    if (error) {
      console.error('Error fetching months:', error);
      throw new Error(`Failed to fetch months: ${error.message}`);
    }

    if (data && data.length > 0) {
      // Extract months from submit_date
      const months = data
        .filter(item => item.submit_date)
        .map(item => {
          const date = new Date(item.submit_date);
          return date.getMonth() + 1; // JavaScript months are 0-indexed
        });
      
      // Get unique months and sort them
      const uniqueMonths = Array.from(new Set(months)).sort((a, b) => a - b);
      
      // Convert month numbers to options with names
      const monthOptions: MonthOption[] = [
        { value: 'all', label: 'All Months' },
        ...uniqueMonths.map(m => ({
          value: m.toString(),
          label: new Date(2000, m - 1, 1).toLocaleString('default', { month: 'long' })
        }))
      ];
      
      console.log(`Found ${uniqueMonths.length} months for year ${selectedYear}:`, monthOptions);
      return monthOptions;
    } 
    
    console.log(`No months found for year ${selectedYear}`);
    return [{ value: 'all', label: 'All Months' }];
  } catch (err) {
    console.error('Error in fetchMonthsForYear:', err);
    throw err;
  }
};

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
  const fetchMonths = useCallback(async (selectedYear: string) => {
    try {
      setIsLoadingMonths(true);
      setMonthsError(null);

      const monthOptions = await fetchMonthsForYear(selectedYear);
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
    fetchMonthsForYear: fetchMonths
  };
}
