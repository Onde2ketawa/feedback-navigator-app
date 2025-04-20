
import { supabase } from '@/integrations/supabase/client';
import { MonthOption } from '@/hooks/useFilterOptions';

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

// Helper function to create the default month options
const getDefaultMonths = (): MonthOption[] => {
  return [
    { value: 'all', label: 'All Months' },
    ...MONTH_NAMES.map((name, index) => ({
      value: (index + 1).toString(),
      label: name
    }))
  ];
};

export const fetchMonthsForYear = async (selectedYear: string): Promise<MonthOption[]> => {
  // Always return all months when 'all' is selected
  if (selectedYear === 'all') {
    return getDefaultMonths();
  }

  try {
    const { data, error } = await supabase
      .from('customer_feedback')
      .select('submit_date')
      .not('submit_date', 'is', null)
      .filter('submit_date', 'ilike', `${selectedYear}-%`);

    if (error) {
      console.error('Error fetching months:', error);
      return getDefaultMonths();
    }

    // Even if no data is found, we'll return all months
    if (!data || data.length === 0) {
      return getDefaultMonths();
    }

    const months = data
      .filter(item => item.submit_date)
      .map(item => {
        const date = new Date(item.submit_date);
        return date.getMonth();
      });

    // Get unique months
    const uniqueMonths = Array.from(new Set(months))
      .sort((a, b) => a - b)
      .map(monthIndex => ({
        value: (monthIndex + 1).toString(),
        label: MONTH_NAMES[monthIndex]
      }));

    // Always include "All Months" option at the beginning
    return [
      { value: 'all', label: 'All Months' },
      ...uniqueMonths.length > 0 ? uniqueMonths : MONTH_NAMES.map((name, index) => ({
        value: (index + 1).toString(),
        label: name
      }))
    ];
  } catch (err) {
    console.error('Error in fetchMonthsForYear:', err);
    // Return default months on error
    return getDefaultMonths();
  }
};
