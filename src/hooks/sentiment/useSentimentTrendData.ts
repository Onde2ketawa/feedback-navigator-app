
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SentimentTrendDataPoint } from './types';

export const useSentimentTrendData = (channelFilter: string) => {
  const [sentimentTrendData, setSentimentTrendData] = useState<SentimentTrendDataPoint[]>([]);
  
  const fetchSentimentTrendData = async (): Promise<SentimentTrendDataPoint[]> => {
    try {
      // Base query to get feedback with sentiment data
      let query = supabase
        .from('customer_feedback')
        .select('submit_date, sentiment, channel_id')
        .order('submit_date', { ascending: true });
        
      // Apply channel filter if not 'all'
      if (channelFilter !== 'all') {
        try {
          const { data: channelData } = await supabase
            .from('channel')
            .select('id')
            .eq('name', channelFilter)
            .single();
          
          if (channelData) {
            query = query.eq('channel_id', channelData.id);
          }
        } catch (err) {
          // If it's already an ID, use it directly
          query = query.eq('channel_id', channelFilter);
        }
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      if (data && data.length > 0) {
        return processSentimentTrendData(data);
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching sentiment trend data:', error);
      return [];
    }
  };
  
  const processSentimentTrendData = (data: any[]): SentimentTrendDataPoint[] => {
    // Group by month for a time series visualization
    const sentimentByDate = new Map<string, { positive: number, neutral: number, negative: number }>();
    
    data.forEach(item => {
      if (!item.submit_date) return;
      
      // Format date as YYYY-MM for monthly grouping
      const date = new Date(item.submit_date);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      // Initialize if first time seeing this month
      if (!sentimentByDate.has(monthYear)) {
        sentimentByDate.set(monthYear, { positive: 0, neutral: 0, negative: 0 });
      }
      
      // Update sentiment count
      const currentValues = sentimentByDate.get(monthYear)!;
      
      if (item.sentiment === 'positive') {
        currentValues.positive++;
      } else if (item.sentiment === 'negative') {
        currentValues.negative++;
      } else {
        currentValues.neutral++;
      }
    });
    
    // Convert to array and sort by date
    const result: SentimentTrendDataPoint[] = Array.from(sentimentByDate.entries())
      .map(([date, counts]) => ({
        date,
        ...counts
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
    
    return result;
  };

  return {
    sentimentTrendData,
    setSentimentTrendData,
    fetchSentimentTrendData
  };
};
