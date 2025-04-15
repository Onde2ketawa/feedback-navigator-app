
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

  // Fetch channels and years on mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setIsLoading(true);
        
        // Fetch unique channels from the channel table
        const { data: channelsData, error: channelError } = await supabase
          .from('channel')
          .select('name')
          .order('name');
        
        if (channelError) {
          console.error('Error fetching channels:', channelError);
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
          return;
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
        }
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
      const { data, error } = await supabase
        .from('customer_feedback')
        .select('submit_date')
        .gte('submit_date', `${selectedYear}-01-01`)
        .lt('submit_date', `${parseInt(selectedYear) + 1}-01-01`);
      
      if (error) {
        console.error('Error fetching months:', error);
        return;
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
    } catch (error) {
      console.error('Error fetching months:', error);
      setAvailableMonths([{ value: 'all', label: 'All Months' }]);
    }
  };

  return {
    availableChannels,
    availableYears,
    availableMonths,
    isLoading,
    fetchMonthsForYear
  };
}
