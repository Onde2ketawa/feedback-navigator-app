
import { supabase } from '@/integrations/supabase/client';
import { MonthOption } from '@/hooks/useFilterOptions';

/**
 * Fetches months for a specific year
 */
export const fetchMonthsForYear = async (selectedYear: string): Promise<MonthOption[]> => {
  // Return default for "all years" selection
  if (selectedYear === 'all') {
    return getDefaultMonths();
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
      
      // If no months found, provide default values
      if (uniqueMonths.length === 0) {
        console.log(`No months found for year ${selectedYear}, providing all months`);
        return getDefaultMonths();
      }
      
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
    
    console.log(`No months found for year ${selectedYear}, providing all months`);
    return getDefaultMonths();
  } catch (err) {
    console.error('Error in fetchMonthsForYear:', err);
    return getDefaultMonths();
  }
};

// Helper function to get default months
function getDefaultMonths(): MonthOption[] {
  return [
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
  ];
}
