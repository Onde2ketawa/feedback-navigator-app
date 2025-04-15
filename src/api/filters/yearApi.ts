
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetches unique years from feedback submissions
 */
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

    if (data && data.length > 0) {
      // Extract years from submit_date and filter out null values
      const years = data
        .filter(item => item.submit_date) 
        .map(item => new Date(item.submit_date).getFullYear().toString());
      
      // Get unique years and sort them in descending order
      const uniqueYears = Array.from(new Set(years))
        .sort((a, b) => parseInt(b) - parseInt(a)); // Latest year first
      
      console.log('Years extracted from query:', uniqueYears);
      
      // If no years found, provide default values
      if (uniqueYears.length === 0) {
        console.log('No years found in data, providing default years');
        return ['all', '2025', '2024', '2023'];
      }
      
      return ['all', ...uniqueYears];
    }
    
    console.log('No year data found in query, providing default years');
    // Provide default years when no data is found
    return ['all', '2025', '2024', '2023'];
  } catch (err) {
    console.error('Error in fetchYears:', err);
    // Return default years even if there's an error
    return ['all', '2025', '2024', '2023'];
  }
};
