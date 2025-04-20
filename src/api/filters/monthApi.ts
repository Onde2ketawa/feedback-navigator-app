import { supabase } from '@/integrations/supabase/client';
import { MonthOption } from '@/hooks/useFilterOptions';

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export const fetchMonthsForYear = async (selectedYear: string): Promise<MonthOption[]> => {
  if (selectedYear === 'all') {
    return MONTH_NAMES.map((name, index) => ({
      value: (index + 1).toString(),
      label: name
    }));
  }

  try {
    const { data, error } = await supabase
      .from('customer_feedback')
      .select('submit_date')
      .not('submit_date', 'is', null)
      .ilike('submit_date', `${selectedYear}-%`);

    if (error) {
      throw error;
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

    return [
      { value: 'all', label: 'All Months' },
      ...uniqueMonths
    ];
  } catch (err) {
    console.error('Error in fetchMonthsForYear:', err);
    return [{ value: 'all', label: 'All Months' }];
  }
};
