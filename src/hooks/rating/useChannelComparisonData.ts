
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RatingTrendData } from './types';

export const useChannelComparisonData = (years: string[]) => {
  const processData = useCallback(async () => {
    try {
      console.log('Fetching channel comparison data for years:', years);
      
      // Query raw data with channel names
      const { data, error } = await supabase
        .from('customer_feedback')
        .select(`
          rating,
          submit_date,
          channel:channel(name)
        `)
        .not('rating', 'is', null);

      if (error) {
        console.error('Error fetching channel data:', error);
        throw error;
      }

      console.log('Raw data count:', data.length);
      
      // Group data by year and channel
      const yearChannelData: { [key: string]: { [channel: string]: { sum: number; count: number } } } = {};
      
      data.forEach(item => {
        const channelName = item.channel?.name;
        const year = new Date(item.submit_date).getFullYear().toString();
        const rating = Number(item.rating);
        
        // Skip if not one of our target channels or years or if rating is invalid
        if (!channelName || !years.includes(year)) return;
        if (channelName !== 'MyHana' && channelName !== 'LINE Bank') return;
        if (isNaN(rating)) return;
        
        // Create year entry if it doesn't exist
        if (!yearChannelData[year]) {
          yearChannelData[year] = {};
        }
        
        // Create channel entry if it doesn't exist
        if (!yearChannelData[year][channelName]) {
          yearChannelData[year][channelName] = { sum: 0, count: 0 };
        }
        
        // Update sum and count
        yearChannelData[year][channelName].sum += rating;
        yearChannelData[year][channelName].count += 1;
      });

      // Convert to RatingTrendData format
      const result: RatingTrendData[] = Object.entries(yearChannelData).map(([year, channels]) => {
        const myHanaData = channels['MyHana'] || { sum: 0, count: 0 };
        const lineBankData = channels['LINE Bank'] || { sum: 0, count: 0 };
        
        const myHanaAvg = myHanaData.count > 0 ? myHanaData.sum / myHanaData.count : 0;
        const lineBankAvg = lineBankData.count > 0 ? lineBankData.sum / lineBankData.count : 0;
        
        console.log(`Year ${year} stats:`, {
          myHana: { avg: myHanaAvg, count: myHanaData.count },
          lineBank: { avg: lineBankAvg, count: lineBankData.count }
        });
        
        return {
          year,
          myHana: myHanaAvg,
          lineBank: lineBankAvg,
          myHanaCount: myHanaData.count,
          lineBankCount: lineBankData.count
        };
      });

      // Sort by year
      const sortedResult = result.sort((a, b) => a.year.localeCompare(b.year));
      console.log('Processed comparison data:', sortedResult);
      
      return sortedResult;

    } catch (error) {
      console.error('Error fetching yearly comparison data:', error);
      return [];
    }
  }, [years]);

  return processData;
};
