
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { fetchMonthsForYear } from '@/api/filters/monthApi';

export interface ChannelOption {
  value: string;
  label: string;
}

export interface MonthOption {
  value: string;
  label: string;
}

export function useFilterOptions() {
  // State definitions with predefined values
  const [availableChannels, setAvailableChannels] = useState<ChannelOption[]>([
    { value: 'all', label: 'All Channels' },
    { value: 'LINE Bank', label: 'LINE Bank' },
    { value: 'MyHana', label: 'MyHana' }
  ]);
  
  const [availableYears] = useState<string[]>(['all', '2024', '2025']);
  
  const [availableMonths, setAvailableMonths] = useState<MonthOption[]>([
    { value: 'all', label: 'All Months' },
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMonths, setIsLoadingMonths] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [monthsError, setMonthsError] = useState<Error | null>(null);

  // Function to fetch months for a specific year
  const fetchMonthsForYearCallback = useCallback(async (selectedYear: string) => {
    if (selectedYear === 'all') {
      // If 'all years' is selected, just use the predefined months
      return;
    }

    setIsLoadingMonths(true);
    try {
      const months = await fetchMonthsForYear(selectedYear);
      
      // Ensure we maintain the correct order - add "All Months" at the beginning
      // and then sort the rest numerically by their month value
      const sortedMonths = [
        { value: 'all', label: 'All Months' },
        ...months.filter(m => m.value !== 'all').sort((a, b) => {
          return parseInt(a.value) - parseInt(b.value);
        })
      ];
      
      setAvailableMonths(sortedMonths);
      setMonthsError(null);
    } catch (err) {
      console.error('Error fetching months:', err);
      setMonthsError(err instanceof Error ? err : new Error('Failed to fetch months'));
      // Fall back to default months
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
    fetchMonthsForYear: fetchMonthsForYearCallback
  };
}
