
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { processRawSentimentData, SentimentTrendMonthYearPoint } from './sentimentTrendTransform';

export const useSentimentTrendData = (channelFilter: string) => {
  const [sentimentTrendData, setSentimentTrendData] = useState<SentimentTrendMonthYearPoint[]>([]);
  
  const fetchSentimentTrendData = async (): Promise<SentimentTrendMonthYearPoint[]> => {
    try {
      console.log(`Fetching sentiment trend data for channel: ${channelFilter}`);
      
      // Set the date range to include all data from April 2024 to the current date
      const startDate = new Date('2024-04-01');
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1); // Include current month
      
      // Base query with date range
      let query = supabase
        .from('customer_feedback')
        .select('submit_date, sentiment')
        .gte('submit_date', startDate.toISOString())
        .lte('submit_date', endDate.toISOString())
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
            
            // New query with channel filter
            query = supabase
              .from('customer_feedback')
              .select('submit_date, sentiment')
              .eq('channel_id', channelData.id)
              .gte('submit_date', startDate.toISOString())
              .lte('submit_date', endDate.toISOString())
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
      
      // Log a sample of the data for debugging
      if (data && data.length > 0) {
        console.log("Sample data:", data.slice(0, 3));
        
        // Check date range in the data
        const dates = data.map(d => new Date(d.submit_date));
        const minDate = dates.length ? new Date(Math.min(...dates.map(d => d.getTime()))) : null;
        const maxDate = dates.length ? new Date(Math.max(...dates.map(d => d.getTime()))) : null;
        
        console.log(`Date range in data: ${minDate?.toISOString()} to ${maxDate?.toISOString()}`);
      }
      
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
