
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SentimentTrendMonthYearPoint } from './sentimentTrendTransform';

export const useSentimentTrendData = () => {
  const [sentimentTrendData, setSentimentTrendData] = useState<SentimentTrendMonthYearPoint[]>([]);

  const fetchSentimentTrendData = async (
    channelFilter: string,
    yearFilter: string,
    monthFilter: string
  ): Promise<SentimentTrendMonthYearPoint[]> => {
    try {
      console.log(`[SentimentTrend] Fetching trend via RPC for channel:`, channelFilter);

      // Call the Supabase function. Pass NULL for 'all', otherwise pass the channel name
      const channelParam = channelFilter === 'all' ? null : channelFilter;
      
      const { data, error } = await supabase
        .rpc('get_sentiment_trend_by_month', { channel_name: channelParam });

      if (error) {
        console.error('[SentimentTrend] Error fetching data via RPC:', error);
        return [];
      }

      console.log('[SentimentTrend] Raw RPC data:', data);

      if (!data || data.length === 0) {
        console.log('[SentimentTrend] No data returned from RPC');
        return [];
      }

      // Map SQL result to the trend point for chart/table
      const mapped: SentimentTrendMonthYearPoint[] = data.map((item: any) => {
        console.log('[SentimentTrend] Processing item:', item);
        return {
          month: item.month_short || '',
          year: item.year?.toString?.() || '',
          positive: Number(item.positive_count || 0),
          neutral: Number(item.neutral_count || 0),
          negative: Number(item.negative_count || 0)
        };
      });

      // Sort by year/month ascending
      mapped.sort((a, b) => {
        if (a.year !== b.year) return parseInt(a.year) - parseInt(b.year);
        const months = [
          "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"
        ];
        return months.indexOf(a.month) - months.indexOf(b.month);
      });

      console.log('[SentimentTrend] Processed and sorted data:', mapped);
      return mapped;
    } catch (error) {
      console.error('[SentimentTrend] Error fetching sentiment trend data:', error);
      return [];
    }
  };

  return {
    sentimentTrendData,
    setSentimentTrendData,
    fetchSentimentTrendData
  };
};
