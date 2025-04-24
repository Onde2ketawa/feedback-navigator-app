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
        
        // Update the accumulator based on the channel name
        // Since the response doesn't contain channel_name directly, extract from name field if available
        // Otherwise, use a direct check if name contains MyHana or LINE Bank
        let channelName = curr.name || '';
        // If name isn't available, try to extract from other fields or use a default logic
        if (!channelName && curr.month) {
          // Using a more reliable approach for channel identification
          if (curr.channel_id) {
            channelName = curr.channel_id.includes('myhana') ? 'MyHana' : 'LINE Bank';
          }
        }
        
        if (channelName.includes('MyHana')) {
          acc[year].myHana = ((acc[year].myHana * acc[year].myHanaCount) + (curr.avg_rating * curr.rating_count)) / (acc[year].myHanaCount + curr.rating_count);
          acc[year].myHanaCount += curr.rating_count;
        } else {
          // Assume it's LINE Bank if not MyHana
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
