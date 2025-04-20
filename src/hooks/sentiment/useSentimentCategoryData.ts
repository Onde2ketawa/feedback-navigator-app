
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SentimentCategoryDataPoint } from './types';

export const useSentimentCategoryData = (channelFilter: string) => {
  const [sentimentCategoryData, setSentimentCategoryData] = 
    useState<SentimentCategoryDataPoint[]>([]);
  
  const fetchSentimentCategoryData = async (): Promise<SentimentCategoryDataPoint[]> => {
    try {
      // Base query to get category and sentiment data
      let query = supabase
        .from('customer_feedback')
        .select('category, sentiment_score, channel_id')
        .not('category', 'is', null); // Exclude rows with no category
        
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
        console.log("Category sentiment raw data sample:", data.slice(0, 10));
        return processCategorySentimentData(data);
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching category sentiment data:', error);
      return [];
    }
  };
  
  const processCategorySentimentData = (data: any[]): SentimentCategoryDataPoint[] => {
    // Group by category to calculate average sentiment scores
    const categorySentiment: Record<string, {total: number, count: number}> = {};
    
    // Process data
    data.forEach(item => {
      if (!item.category) return;
      
      const category = item.category;
      const sentimentScore = typeof item.sentiment_score === 'number' 
        ? item.sentiment_score 
        : 0;
      
      // Initialize category entry if it doesn't exist
      if (!categorySentiment[category]) {
        categorySentiment[category] = { total: 0, count: 0 };
      }
      
      // Add to totals
      categorySentiment[category].total += sentimentScore;
      categorySentiment[category].count++;
    });
    
    // Calculate averages and transform to expected format
    const result: SentimentCategoryDataPoint[] = Object.entries(categorySentiment)
      .map(([category, data]) => ({
        name: category,
        sentiment_score: data.count > 0 ? data.total / data.count : 0,
        count: data.count
      }));
    
    console.log("Final category sentiment data:", result);
    
    return result;
  };

  return {
    sentimentCategoryData,
    setSentimentCategoryData,
    fetchSentimentCategoryData
  };
};
