
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
      console.log('Raw submit_dates:', data.map(item => item.submit_date));
      
      const years = data
        .filter(item => item.submit_date) 
        .map(item => {
          const year = new Date(item.submit_date).getFullYear();
          console.log(`Converting ${item.submit_date} to year: ${year}`);
          return year.toString();
        });
      
      console.log('Extracted years:', years);
      
      // Get unique years and sort them in descending order
      const uniqueYears = Array.from(new Set(years))
        .sort((a, b) => parseInt(b) - parseInt(a)); // Latest year first
      
      console.log('Unique sorted years:', uniqueYears);
      
      // Return all years with 'all' option at the beginning
      if (uniqueYears.length > 0) {
        return ['all', ...uniqueYears];
      }
      
      // If no years found in data, provide comprehensive default years
      console.log('No years found in data, providing default years');
      return ['all', '2025', '2024', '2023', '2022', '2021', '2020'];
    }
    
    console.log('No year data found in query, providing default years');
    // Provide comprehensive default years
    return ['all', '2025', '2024', '2023', '2022', '2021', '2020'];
  } catch (err) {
    console.error('Error in fetchYears:', err);
    // Return comprehensive default years even if there's an error
    return ['all', '2025', '2024', '2023', '2022', '2021', '2020'];
  }
};
