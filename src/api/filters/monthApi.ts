
import { supabase } from '@/integrations/supabase/client';
import { MonthOption } from '@/hooks/useFilterOptions';

/**
 * Fetches months for a specific year
 */
export const fetchMonthsForYear = async (selectedYear: string): Promise<MonthOption[]> => {
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
