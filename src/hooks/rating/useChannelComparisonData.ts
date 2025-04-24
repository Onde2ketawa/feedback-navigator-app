
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RatingTrendData } from './types';

export const useChannelComparisonData = (years: string[]) => {
  const processData = useCallback(async () => {
    try {
      // Query channel-specific annual averages directly
      const { data, error } = await supabase
        .from('customer_feedback')
        .select(`
          channel:channel(name),
          rating,
          submit_date
        `)
        .not('rating', 'is', null);

      if (error) throw error;

      // Group by channel and year
      const yearlyDataMap: { [key: string]: RatingTrendData } = {};
      
      data.forEach(item => {
        // Extract channel name and year from data
        const channelName = item.channel?.name;
        const year = new Date(item.submit_date).getFullYear().toString();
        
        // Skip if not one of our target channels or years
        if (!channelName || !years.includes(year)) return;
        if (channelName !== 'MyHana' && channelName !== 'LINE Bank') return;
        
        // Create year entry if it doesn't exist
        if (!yearlyDataMap[year]) {
          yearlyDataMap[year] = {
            year,
            myHana: 0,
            lineBank: 0,
            myHanaCount: 0,
            lineBankCount: 0
          };
        }
        
        // Update the correct channel's rating sum and count
        if (channelName === 'MyHana') {
          yearlyDataMap[year].myHanaCount++;
          const newTotal = yearlyDataMap[year].myHana * (yearlyDataMap[year].myHanaCount - 1) + item.rating;
          yearlyDataMap[year].myHana = newTotal / yearlyDataMap[year].myHanaCount;
        } else if (channelName === 'LINE Bank') {
          yearlyDataMap[year].lineBankCount++;
          const newTotal = yearlyDataMap[year].lineBank * (yearlyDataMap[year].lineBankCount - 1) + item.rating;
          yearlyDataMap[year].lineBank = newTotal / yearlyDataMap[year].lineBankCount;
        }
      });

      // Convert to array and sort by year
      return Object.values(yearlyDataMap)
        .sort((a: RatingTrendData, b: RatingTrendData) => a.year.localeCompare(b.year));

    } catch (error) {
      console.error('Error fetching yearly comparison data:', error);
      return [];
    }
  }, [years]);

  return processData;
};
