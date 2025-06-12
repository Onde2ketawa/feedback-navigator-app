
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

      // For channel filtering, we need to pass the actual channel name from the availableChannels
      // If channelFilter is 'all', pass null to get all channels
      // If channelFilter is a UUID (channel ID), we need to get the channel name
      let channelParam: string | null = null;
      
      if (channelFilter !== 'all') {
        // Get the channel name from the channel ID
        const { data: channelData, error: channelError } = await supabase
          .from('channel')
          .select('name')
          .eq('id', channelFilter)
          .single();
          
        if (channelError) {
          console.error('[SentimentTrend] Error fetching channel name:', channelError);
          return [];
        }
        
        channelParam = channelData?.name || null;
        console.log(`[SentimentTrend] Resolved channel ID ${channelFilter} to name:`, channelParam);
      }
      
      console.log(`[SentimentTrend] Calling RPC with channel param:`, channelParam);
      
      const { data, error } = await supabase
        .rpc('get_sentiment_trend_by_month', { 
          channel_name: channelParam 
        });

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
      console.log('[SentimentTrend] Total data points returned:', mapped.length);
      
      // Additional debugging for data validation
      const hasData = mapped.some(d => d.positive > 0 || d.neutral > 0 || d.negative > 0);
      console.log('[SentimentTrend] Has actual sentiment data:', hasData);
      
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
