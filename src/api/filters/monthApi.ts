
import { supabase } from '@/integrations/supabase/client';
import { MonthOption } from '@/hooks/useFilterOptions';

/**
 * Fetches months for a specific year
 */
export const fetchMonthsForYear = async (selectedYear: string): Promise<MonthOption[]> => {
  // Always return all months for any year selection
  return getDefaultMonths();
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
