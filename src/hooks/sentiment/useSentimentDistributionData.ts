
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SentimentDistributionDataPoint } from './types';

export const useSentimentDistributionData = () => {
  const [sentimentDistributionData, setSentimentDistributionData] = 
    useState<SentimentDistributionDataPoint[]>([]);
  
  const fetchSentimentDistributionData = async (
    channelFilter: string,
    yearFilter: string,
    monthFilter: string
  ): Promise<SentimentDistributionDataPoint[]> => {
    try {
      // Base query to get sentiment distribution
      let query = supabase
        .from('customer_feedback')
        .select('sentiment, channel_id');
        
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
      if (data) {
        console.log("Sentiment distribution raw data sample:", data.slice(0, 10));
        return processSentimentDistributionData(data);
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching sentiment distribution data:', error);
      return [];
    }
  };
  
  const processSentimentDistributionData = (data: any[]): SentimentDistributionDataPoint[] => {
    // Initialize counters
    const distribution: Record<string, number> = {
      positive: 0,
      neutral: 0,
      negative: 0
    };
    
    // Count sentiments
    data.forEach(item => {
      const sentiment = item.sentiment || 'neutral';
      
      // Ensure the sentiment is one of our expected values
      if (['positive', 'neutral', 'negative'].includes(sentiment)) {
        distribution[sentiment]++;
      } else {
        // Default to neutral for unexpected values
        distribution.neutral++;
      }
    });
    
    // Colors for different sentiments
    const colors = {
      positive: '#10b981', // green
      neutral: '#facc15',  // yellow
      negative: '#f43f5e'  // red
    };
    
    // Transform to expected format
    const result: SentimentDistributionDataPoint[] = Object.entries(distribution).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize
      value,
      color: colors[name as keyof typeof colors]
    }));
    
    console.log("Final sentiment distribution data:", result);
    
    return result;
  };

  return {
    sentimentDistributionData,
    setSentimentDistributionData,
    fetchSentimentDistributionData
  };
};
