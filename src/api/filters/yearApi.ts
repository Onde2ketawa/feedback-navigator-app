
import { supabase } from '@/integrations/supabase/client';

export const fetchYears = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('customer_feedback')
      .select('submit_date')
      .not('submit_date', 'is', null);

    if (error) {
      console.error('Error fetching years:', error);
      throw new Error(`Failed to fetch years: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return ['all'];
    }

    const years = data
      .filter(item => item.submit_date)
      .map(item => {
        const date = new Date(item.submit_date);
        return date.getFullYear().toString();
      });

    // Get unique years and sort them in descending order
    const uniqueYears = Array.from(new Set(years)).sort((a, b) => parseInt(b) - parseInt(a));

    return ['all', ...uniqueYears];
  } catch (err) {
    console.error('Error in fetchYears:', err);
    throw err;
  }
};
