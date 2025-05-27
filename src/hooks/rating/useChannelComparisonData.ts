
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RatingTrendData } from './types';

interface DatabaseChannelRating {
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
      
      if (!data || !Array.isArray(data)) {
        console.log('No data returned from database function');
        return [];
      }
      
      // Process the data into the expected format
      const result: RatingTrendData[] = [];
      
      // Group data by year
      const dataByYear: { [key: string]: DatabaseChannelRating[] } = {};
      
      data.forEach((item: DatabaseChannelRating) => {
        const yearKey = item.year.toString();
        if (!dataByYear[yearKey]) {
          dataByYear[yearKey] = [];
        }
        dataByYear[yearKey].push(item);
      });
      
      // Convert to RatingTrendData format
      years.forEach(year => {
        const yearData = dataByYear[year] || [];
        
        const myHanaData = yearData.find(item => item.channel_name === 'MyHana');
        const lineBankData = yearData.find(item => item.channel_name === 'LINE Bank');
        
        result.push({
          year,
          myHana: myHanaData ? Number(myHanaData.avg_rating) : 0,
          lineBank: lineBankData ? Number(lineBankData.avg_rating) : 0,
          myHanaCount: myHanaData ? Number(myHanaData.rating_count) : 0,
          lineBankCount: lineBankData ? Number(lineBankData.rating_count) : 0
        });
      });

      console.log('Processed comparison data:', result);
      return result;

    } catch (error) {
      console.error('Error fetching yearly comparison data:', error);
      return [];
    }
  }, [years]);

  return processData;
};
