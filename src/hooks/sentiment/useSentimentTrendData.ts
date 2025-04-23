
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { processRawSentimentData, SentimentTrendMonthYearPoint } from './sentimentTrendTransform';

export const useSentimentTrendData = (channelFilter: string) => {
  const [sentimentTrendData, setSentimentTrendData] = useState<SentimentTrendMonthYearPoint[]>([]);
  
  const fetchSentimentTrendData = async (): Promise<SentimentTrendMonthYearPoint[]> => {
    try {
      console.log(`Fetching sentiment trend data for channel: ${channelFilter}`);
      
      // Base query with explicit ordering to ensure we get ALL data chronologically
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
            console.log(`Found channel ID for ${channelFilter}:`, channelData.id);
            
            // Apply channel filter but NO date restrictions
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
      
      // Enhanced logging for debugging
      if (data && data.length > 0) {
        console.log("First few records:", data.slice(0, 3));
        console.log("Last few records:", data.slice(-3));
        
        // Check and log the full date range in the data
        const dates = data.map(d => new Date(d.submit_date));
        const minDate = dates.length ? new Date(Math.min(...dates.map(d => d.getTime()))) : null;
        const maxDate = dates.length ? new Date(Math.max(...dates.map(d => d.getTime()))) : null;
        
        console.log(`Date range in data: ${minDate?.toISOString()} to ${maxDate?.toISOString()}`);
        
        // Count records by year and month for detailed debugging
        const monthCounts: Record<string, number> = {};
        data.forEach(d => {
          if (d.submit_date) {
            const date = new Date(d.submit_date);
            const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
            monthCounts[key] = (monthCounts[key] || 0) + 1;
          }
        });
        console.log("Records by year-month:", monthCounts);
      }
      
      // Process the data without any filtering
      const processedData = processRawSentimentData(data || []);
      console.log("Processed trend data:", processedData);
      return processedData;
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
