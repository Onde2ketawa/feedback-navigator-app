
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CategoryRatingDataPoint } from './types';

export const useCategoryRatingData = (
  channelFilter: string,
  yearFilter: string,
  monthFilter: string
) => {
  const [categoryRatingData, setCategoryRatingData] = useState<CategoryRatingDataPoint[]>([]);

  const fetchCategoryRatingData = async (): Promise<CategoryRatingDataPoint[]> => {
    try {
      console.log("Fetching category rating data with filters:", { channelFilter, yearFilter, monthFilter });
      
      // Build the base query joining customer_feedback with channel to get channel names
      let query = supabase
        .from('customer_feedback')
        .select(`
          rating,
          channel_id,
          submit_date,
          channel:channel_id (
            id,
            name
          )
        `);

      // Apply channel filter if not 'all'
      if (channelFilter !== 'all') {
        query = query.eq('channel_id', channelFilter);
      }

      // Apply year filter if not 'all'
      if (yearFilter !== 'all') {
        const year = parseInt(yearFilter);
        query = query.gte('submit_date', `${year}-01-01`);
        query = query.lt('submit_date', `${year + 1}-01-01`);
      }

      // Apply month filter if not 'all'
      if (monthFilter !== 'all') {
        const month = parseInt(monthFilter);
        const year = yearFilter !== 'all' ? parseInt(yearFilter) : new Date().getFullYear();
        const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
        const endDate = month === 12 
          ? `${year + 1}-01-01` 
          : `${year}-${(month + 1).toString().padStart(2, '0')}-01`;
        
        query = query.gte('submit_date', startDate);
        query = query.lt('submit_date', endDate);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        console.log("Category rating raw data:", data);
        return processCategoryRatingData(data);
      }

      return [];
    } catch (error) {
      console.error('Error fetching category rating data:', error);
      return [];
    }
  };

  const processCategoryRatingData = (data: any[]): CategoryRatingDataPoint[] => {
    // Group by channel and calculate average rating
    const channelRatings: Record<string, { total: number; count: number; name: string }> = {};

    data.forEach(item => {
      if (!item.channel || !item.rating) return;

      const channelName = item.channel.name;
      const rating = typeof item.rating === 'number' ? item.rating : parseFloat(item.rating);

      if (isNaN(rating)) return;

      if (!channelRatings[channelName]) {
        channelRatings[channelName] = { total: 0, count: 0, name: channelName };
      }

      channelRatings[channelName].total += rating;
      channelRatings[channelName].count += 1;
    });

    // Convert to array format with average ratings
    const result = Object.values(channelRatings).map(channel => ({
      name: channel.name,
      rating: Number((channel.total / channel.count).toFixed(2))
    }));

    console.log("Processed category rating data:", result);
    return result;
  };

  return {
    categoryRatingData,
    setCategoryRatingData,
    fetchCategoryRatingData
  };
};
