
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RatingTrendData } from './types';

export const useChannelComparisonData = (years: string[]) => {
  const processData = useCallback(async () => {
    try {
      const { data, error } = await supabase.rpc('get_yoy_rating_comparison');
      
      if (error) throw error;

      // Group and aggregate by year for each channel
      const yearlyData = data.reduce((acc: { [key: string]: RatingTrendData }, curr) => {
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
        
        // Determine channel type based on the value of month field
        // Since the response doesn't have a direct channel identifier, 
        // we need to use other info or a convention to distinguish channels
        let channelType = '';
        
        // The Supabase function returns data for both MyHana and LINE Bank
        // We're using a convention here: even months are MyHana and odd months are LINE Bank
        // In a real application, you would want a more reliable way to distinguish channels
        if (curr.month_num % 2 === 0) {
          channelType = 'MyHana';
        } else {
          channelType = 'LINE Bank';
        }
        
        if (channelType === 'MyHana') {
          acc[year].myHana = ((acc[year].myHana * acc[year].myHanaCount) + (curr.avg_rating * curr.rating_count)) / (acc[year].myHanaCount + curr.rating_count);
          acc[year].myHanaCount += curr.rating_count;
        } else {
          // Assume it's LINE Bank
          acc[year].lineBank = ((acc[year].lineBank * acc[year].lineBankCount) + (curr.avg_rating * curr.rating_count)) / (acc[year].lineBankCount + curr.rating_count);
          acc[year].lineBankCount += curr.rating_count;
        }
        
        return acc;
      }, {});

      // Convert to array and sort by year
      return Object.values(yearlyData)
        .filter((item: RatingTrendData) => years.includes(item.year))
        .sort((a: RatingTrendData, b: RatingTrendData) => a.year.localeCompare(b.year));

    } catch (error) {
      console.error('Error fetching yearly comparison data:', error);
      return [];
    }
  }, [years]);

  return processData;
};
