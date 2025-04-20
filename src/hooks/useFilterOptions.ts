
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
  // State for channels with proper IDs
  const [availableChannels, setAvailableChannels] = useState<ChannelOption[]>([
    { value: 'all', label: 'All Channels' }
  ]);
  
  const [availableYears] = useState<string[]>(['all', '2024', '2025']);
  
  const [availableMonths, setAvailableMonths] = useState<MonthOption[]>([
    { value: 'all', label: 'All Months' },
    { value: '1', label: 'Jan' },
    { value: '2', label: 'Feb' },
    { value: '3', label: 'Mar' },
    { value: '4', label: 'Apr' },
    { value: '5', label: 'May' },
    { value: '6', label: 'Jun' },
    { value: '7', label: 'Jul' },
    { value: '8', label: 'Aug' },
    { value: '9', label: 'Sep' },
    { value: '10', label: 'Oct' },
    { value: '11', label: 'Nov' },
    { value: '12', label: 'Dec' }
  ]);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMonths, setIsLoadingMonths] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [monthsError, setMonthsError] = useState<Error | null>(null);

  // Fetch channels from the database
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const { data, error } = await supabase
          .from('channel')
          .select('id, name')
          .order('name');
        
        if (error) throw error;
        
        if (data) {
          const channelOptions = [
            { value: 'all', label: 'All Channels' },
            ...data.map(channel => ({
              value: channel.id,  // Use the actual UUID as the value
              label: channel.name
            }))
          ];
          setAvailableChannels(channelOptions);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching channels:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch channels'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchChannels();
  }, []);

  // Function to fetch months for a specific year
  const fetchMonthsForYearCallback = useCallback(async (selectedYear: string) => {
    console.log('fetchMonthsForYearCallback called with year:', selectedYear);
    
    if (selectedYear === 'all') {
      // If 'all years' is selected, reset to the predefined months
      setAvailableMonths([
        { value: 'all', label: 'All Months' },
        { value: '1', label: 'Jan' },
        { value: '2', label: 'Feb' },
        { value: '3', label: 'Mar' },
        { value: '4', label: 'Apr' },
        { value: '5', label: 'May' },
        { value: '6', label: 'Jun' },
        { value: '7', label: 'Jul' },
        { value: '8', label: 'Aug' },
        { value: '9', label: 'Sep' },
        { value: '10', label: 'Oct' },
        { value: '11', label: 'Nov' },
        { value: '12', label: 'Dec' }
      ]);
      return;
    }

    setIsLoadingMonths(true);
    try {
      const months = await fetchMonthsForYear(selectedYear);
      console.log('Months returned from API:', months);
      
      // Ensure we maintain the correct order - add "All Months" at the beginning
      // and then sort the rest numerically by their month value
      const sortedMonths = [
        { value: 'all', label: 'All Months' },
        ...months.filter(m => m.value !== 'all').sort((a, b) => {
          return parseInt(a.value) - parseInt(b.value);
        })
      ];
      
      console.log('Setting available months to:', sortedMonths);
      setAvailableMonths(sortedMonths);
      setMonthsError(null);
    } catch (err) {
      console.error('Error fetching months:', err);
      setMonthsError(err instanceof Error ? err : new Error('Failed to fetch months'));
      
      // Fall back to default months on error
      setAvailableMonths([
        { value: 'all', label: 'All Months' },
        { value: '1', label: 'Jan' },
        { value: '2', label: 'Feb' },
        { value: '3', label: 'Mar' },
        { value: '4', label: 'Apr' },
        { value: '5', label: 'May' },
        { value: '6', label: 'Jun' },
        { value: '7', label: 'Jul' },
        { value: '8', label: 'Aug' },
        { value: '9', label: 'Sep' },
        { value: '10', label: 'Oct' },
        { value: '11', label: 'Nov' },
        { value: '12', label: 'Dec' }
      ]);
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
