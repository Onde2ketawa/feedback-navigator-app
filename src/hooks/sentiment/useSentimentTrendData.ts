
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { processRawSentimentData, SentimentTrendMonthYearPoint } from './sentimentTrendTransform';

export const useSentimentTrendData = (channelFilter: string) => {
  const [sentimentTrendData, setSentimentTrendData] = useState<SentimentTrendMonthYearPoint[]>([]);
  
  const fetchSentimentTrendData = async (): Promise<SentimentTrendMonthYearPoint[]> => {
    try {
      // Direct query approach
      let query = supabase
        .from('customer_feedback')
        .select('submit_date, sentiment')
        .order('submit_date');
      
      // Apply channel filter if needed
      if (channelFilter !== 'all') {
        try {
          const { data: channelData } = await supabase
            .from('channel')
            .select('id')
            .eq('name', channelFilter)
            .maybeSingle();
          
          if (channelData) {
            query = supabase
              .from('customer_feedback')
              .select('submit_date, sentiment')
              .eq('channel_id', channelData.id)
              .order('submit_date');
          }
        } catch (err) {
          console.error("Channel lookup failed:", err);
          return [];
        }
      }
      
      // Execute the query
      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching data:", error);
        return [];
      }
      
      console.log(`Raw data count: ${data?.length || 0} records`);
      return processRawSentimentData(data || []);
    } catch (error) {
      console.error('Error fetching sentiment trend data:', error);
      return [];
    }
  };

  return {
    sentimentTrendData,
    setSentimentTrendData,
    fetchSentimentTrendData
  };
};
