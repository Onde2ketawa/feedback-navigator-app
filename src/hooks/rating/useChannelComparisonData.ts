
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useChannelComparisonData = (years: string[]) => {
  const processData = useCallback(async () => {
    try {
      const { data, error } = await supabase.rpc('get_yoy_rating_comparison');
      
      if (error) throw error;

      // Group and aggregate by year for each channel
      const yearlyData = data.reduce((acc: { [key: string]: any }, curr) => {
        const year = curr.year.toString();
        
        if (!acc[year]) {
          acc[year] = {
            year,
            myHana: 0,
            lineBank: 0,
            myHanaCount: 0,
            lineBankCount: 0,
          };
        }
        
        // Update the accumulator based on the channel
        if (curr.channel === 'MyHana') {
          acc[year].myHana = ((acc[year].myHana * acc[year].myHanaCount) + (curr.avg_rating * curr.rating_count)) / (acc[year].myHanaCount + curr.rating_count);
          acc[year].myHanaCount += curr.rating_count;
        } else if (curr.channel === 'LINE Bank') {
          acc[year].lineBank = ((acc[year].lineBank * acc[year].lineBankCount) + (curr.avg_rating * curr.rating_count)) / (acc[year].lineBankCount + curr.rating_count);
          acc[year].lineBankCount += curr.rating_count;
        }
        
        return acc;
      }, {});

      // Convert to array and sort by year
      return Object.values(yearlyData)
        .filter((item: any) => years.includes(item.year))
        .sort((a: any, b: any) => a.year.localeCompare(b.year));

    } catch (error) {
      console.error('Error fetching yearly comparison data:', error);
      return [];
    }
  }, [years]);

  return processData;
};
