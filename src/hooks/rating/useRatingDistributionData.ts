
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RatingDistributionDataPoint } from './types';
import { ratingDistributionData as defaultRatingDistributionData } from '@/data/ratingsMockData';

export const useRatingDistributionData = (channelFilter: string) => {
  const [ratingDistributionData, setRatingDistributionData] = 
    useState<RatingDistributionDataPoint[]>(defaultRatingDistributionData);
  
  const fetchRatingDistributionData = async (): Promise<RatingDistributionDataPoint[]> => {
    try {
      let query = supabase
        .from('customer_feedback')
        .select('rating');
        
      // Apply channel filter if not 'all'
      if (channelFilter !== 'all') {
        // Try to get the channel ID if it's a name instead of an ID
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
        console.log("Rating distribution raw data sample:", data.slice(0, 10));
        return processRatingDistributionData(data);
      }
      
      return defaultRatingDistributionData;
    } catch (error) {
      console.error('Error fetching rating distribution data:', error);
      return defaultRatingDistributionData;
    }
  };
  
  const processRatingDistributionData = (data: any[]): RatingDistributionDataPoint[] => {
    // Process the data to get rating distribution
    const distribution: Record<number, number> = {};
    
    // Count ratings
    data.forEach(item => {
      // Parse rating properly
      let rating: number;
      
      if (typeof item.rating === 'number') {
        rating = item.rating;
      } else if (typeof item.rating === 'string') {
        rating = parseFloat(item.rating);
      } else {
        console.warn(`Invalid rating type:`, typeof item.rating);
        return; // Skip invalid ratings
      }
      
      if (isNaN(rating) || rating < 1 || rating > 5) {
        console.warn(`Invalid rating value: ${item.rating}, skipping`);
        return;
      }
      
      // Round to nearest integer to ensure we have clean categories
      const ratingInt = Math.round(rating);
      
      if (!distribution[ratingInt]) {
        distribution[ratingInt] = 0;
      }
      distribution[ratingInt]++;
    });
    
    console.log("Processed rating distribution:", distribution);
    
    // Colors for different ratings
    const colors = ['#f43f5e', '#f97316', '#facc15', '#a3e635', '#10b981'];
    
    // Transform to expected format
    const result: RatingDistributionDataPoint[] = [];
    for (let i = 1; i <= 5; i++) {
      result.push({
        rating: `${i} Star${i !== 1 ? 's' : ''}`,
        count: distribution[i] || 0,
        color: colors[i-1]
      });
    }
    
    console.log("Final rating distribution data:", result);
    
    return result;
  };

  return {
    ratingDistributionData,
    setRatingDistributionData,
    fetchRatingDistributionData
  };
};
