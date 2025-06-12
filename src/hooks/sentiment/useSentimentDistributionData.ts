
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
      console.log(`[SentimentDistribution] Fetching data for channel:`, channelFilter);
      
      // Base query to get sentiment distribution
      let query = supabase
        .from('customer_feedback')
        .select('sentiment');
        
      // Apply channel filter if not 'all'
      if (channelFilter !== 'all') {
        console.log(`[SentimentDistribution] Filtering by channel ID:`, channelFilter);
        query = query.eq('channel_id', channelFilter);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('[SentimentDistribution] Error fetching data:', error);
        throw error;
      }
      
      if (data) {
        console.log(`[SentimentDistribution] Raw data count:`, data.length);
        console.log(`[SentimentDistribution] Sample data:`, data.slice(0, 5));
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
      const sentiment = (item.sentiment || 'neutral').toLowerCase();
      
      // Ensure the sentiment is one of our expected values
      if (['positive', 'neutral', 'negative'].includes(sentiment)) {
        distribution[sentiment]++;
      } else {
        // Default to neutral for unexpected values
        distribution.neutral++;
      }
    });
    
    console.log(`[SentimentDistribution] Processed distribution:`, distribution);
    
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
    
    console.log(`[SentimentDistribution] Final result:`, result);
    
    return result;
  };

  return {
    sentimentDistributionData,
    setSentimentDistributionData,
    fetchSentimentDistributionData
  };
};
