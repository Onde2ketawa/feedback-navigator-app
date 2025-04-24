
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RatingTrendData } from './types';

interface AnnualChannelRating {
  year: number;
  channel_name: string;
  avg_rating: number;
  rating_count: number;
}

export const useChannelComparisonData = (years: string[]) => {
  const processData = useCallback(async () => {
    try {
      console.log('Fetching channel comparison data for years:', years);
      
      // Direct SQL query to get accurate average ratings by year and channel
      const { data, error } = await supabase
        .rpc('get_annual_channel_ratings', { 
          year_filters: years 
        });
      
      if (error) {
        console.error('Error fetching channel data:', error);
        throw error;
      }

      console.log('Raw data from database function:', data);
      
      // Convert to RatingTrendData format
      const result: RatingTrendData[] = [];
      
      // Type assertion to help TypeScript understand the data structure
      const typedData = data as AnnualChannelRating[];
      
      // Process data by year
      for (const year of years) {
        const yearData = typedData.filter(item => item.year.toString() === year);
        const myHanaData = yearData.find(item => item.channel_name === 'MyHana');
        const lineBankData = yearData.find(item => item.channel_name === 'LINE Bank');
        
        result.push({
          year,
          myHana: myHanaData?.avg_rating || 0,
          lineBank: lineBankData?.avg_rating || 0,
          myHanaCount: myHanaData?.rating_count || 0,
          lineBankCount: lineBankData?.rating_count || 0
        });
      }

      console.log('Processed comparison data:', result);
      return result;

    } catch (error) {
      console.error('Error fetching yearly comparison data:', error);
      return [];
    }
  }, [years]);

  return processData;
};
