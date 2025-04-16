
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
        query = query.eq('channel_id', channelFilter);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      if (data) return processRatingDistributionData(data);
      
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
      if (!distribution[item.rating]) {
        distribution[item.rating] = 0;
      }
      distribution[item.rating]++;
    });
    
    // Colors for different ratings
    const colors = ['#f43f5e', '#f97316', '#a3e635', '#14b8a6', '#6366f1'];
    
    // Transform to expected format
    const result: RatingDistributionDataPoint[] = [];
    for (let i = 1; i <= 5; i++) {
      result.push({
        rating: `${i} Star${i !== 1 ? 's' : ''}`,
        count: distribution[i] || 0,
        color: colors[i-1]
      });
    }
    
    return result;
  };

  return {
    ratingDistributionData,
    setRatingDistributionData,
    fetchRatingDistributionData
  };
};
