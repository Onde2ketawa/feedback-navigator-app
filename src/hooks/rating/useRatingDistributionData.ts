import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RatingDistributionDataPoint } from './types';
import { ratingDistributionData as defaultRatingDistributionData } from '@/data/ratingsMockData';

export const useRatingDistributionData = (channelFilter: string) => {
  const [ratingDistributionData, setRatingDistributionData] = 
    useState<RatingDistributionDataPoint[]>(defaultRatingDistributionData);
  
  const fetchRatingDistributionData = async (): Promise<RatingDistributionDataPoint[]> => {
    try {
      console.log("Fetching rating distribution data with channel filter:", channelFilter);
      
      let query = supabase
        .from('customer_feedback')
        .select('rating, submit_date');
        
      // Apply channel filter if not 'all'
      if (channelFilter !== 'all') {
        // Direct filter on channel_id (assuming channelFilter is already the ID)
        query = query.eq('channel_id', channelFilter);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      if (data) {
        console.log("Rating distribution raw data count:", data.length);
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
    // Initialize distribution with all possible ratings (1-5)
    const distribution: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    };
    
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
      
      // Increment the count for this rating
      distribution[ratingInt]++;
    });
    
    console.log("Processed rating distribution:", distribution);
    
    // Colors for different ratings
    const colors = ['#f43f5e', '#f97316', '#facc15', '#a3e635', '#10b981'];
    
    // Transform to expected format - ensure all ratings 1-5 are included
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
