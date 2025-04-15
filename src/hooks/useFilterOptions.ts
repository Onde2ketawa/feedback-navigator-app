
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ChannelOption {
  value: string;
  label: string;
}

export interface MonthOption {
  value: string;
  label: string;
}

export function useFilterOptions() {
  const [availableChannels, setAvailableChannels] = useState<ChannelOption[]>([]);
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [availableMonths, setAvailableMonths] = useState<MonthOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMonths, setIsLoadingMonths] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [monthsError, setMonthsError] = useState<Error | null>(null);

  // Fetch channels and years on mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch unique channels from the channel table
        const { data: channelsData, error: channelError } = await supabase
          .from('channel')
          .select('name')
          .order('name');
        
        if (channelError) {
          console.error('Error fetching channels:', channelError);
          throw new Error(`Failed to fetch channels: ${channelError.message}`);
        }
        
        // Set channels with 'all' option first
        setAvailableChannels([
          { value: 'all', label: 'All Channels' },
          ...(channelsData?.map(c => ({ value: c.name, label: c.name })) || [])
        ]);

        // Fetch unique years from submit_date
        const { data: yearsData, error: yearsError } = await supabase
          .from('customer_feedback')
          .select('submit_date');
        
        if (yearsError) {
          console.error('Error fetching years:', yearsError);
          throw new Error(`Failed to fetch years: ${yearsError.message}`);
        }

        if (yearsData && yearsData.length > 0) {
          // Extract years from submit_date and filter out null values
          const years = yearsData
            .filter(item => item.submit_date) // Filter out null dates
            .map(item => new Date(item.submit_date).getFullYear().toString());
          
          // Get unique years and sort them in descending order
          const uniqueYears = Array.from(new Set(years))
            .sort((a, b) => parseInt(b) - parseInt(a)); // Latest year first
          
          setAvailableYears(['all', ...uniqueYears]);
        } else {
          setAvailableYears(['all']); // Default to just 'all' if no data
        }
      } catch (err) {
        console.error('Error in fetchFilterOptions:', err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  // Function to fetch months for a specific year
  const fetchMonthsForYear = async (selectedYear: string) => {
    if (selectedYear === 'all') {
      setAvailableMonths([{ value: 'all', label: 'All Months' }]);
      return;
    }

    try {
      setIsLoadingMonths(true);
      setMonthsError(null);

      const { data, error } = await supabase
        .from('customer_feedback')
        .select('submit_date')
        .gte('submit_date', `${selectedYear}-01-01`)
        .lt('submit_date', `${parseInt(selectedYear) + 1}-01-01`);
      
      if (error) {
        console.error('Error fetching months:', error);
        throw new Error(`Failed to fetch months: ${error.message}`);
      }

      if (data && data.length > 0) {
        // Extract months from submit_date and filter out null values
        const months = data
          .filter(item => item.submit_date) // Filter out null dates
          .map(item => (new Date(item.submit_date).getMonth() + 1).toString());
        
        // Get unique months and sort them
        const uniqueMonths = Array.from(new Set(months))
          .sort((a, b) => parseInt(a) - parseInt(b));
        
        setAvailableMonths([
          { value: 'all', label: 'All Months' },
          ...uniqueMonths.map(m => ({
            value: m,
            label: new Date(2000, parseInt(m) - 1, 1).toLocaleString('default', { month: 'long' })
          }))
        ]);
      } else {
        setAvailableMonths([{ value: 'all', label: 'All Months' }]);
      }
    } catch (err) {
      console.error('Error in fetchMonthsForYear:', err);
      setMonthsError(err instanceof Error ? err : new Error('An unknown error occurred'));
      setAvailableMonths([{ value: 'all', label: 'All Months' }]);
    } finally {
      setIsLoadingMonths(false);
    }
  };

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
