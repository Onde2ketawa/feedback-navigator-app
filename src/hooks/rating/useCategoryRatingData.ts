
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
      let query = supabase
        .from('customer_feedback')
        .select('category, rating');
        
      // Apply filters based on selected options
      if (channelFilter !== 'all') {
        query = query.eq('channel_id', channelFilter);
      }
      
      // Filter non-null categories
      query = query.not('category', 'is', null);
      
      // Add year filter if not 'all'
      if (yearFilter !== 'all') {
        const yearStart = `${yearFilter}-01-01`;
        const yearEnd = `${yearFilter}-12-31`;
        query = query.gte('submit_date', yearStart).lte('submit_date', yearEnd);
      }
      
      // Add month filter if not 'all'
      if (monthFilter !== 'all' && yearFilter !== 'all') {
        const monthNum = parseInt(monthFilter);
        const monthStr = monthNum < 10 ? `0${monthNum}` : `${monthNum}`;
        const monthStart = `${yearFilter}-${monthStr}-01`;
        const lastDay = new Date(parseInt(yearFilter), monthNum, 0).getDate();
        const monthEnd = `${yearFilter}-${monthStr}-${lastDay}`;
        query = query.gte('submit_date', monthStart).lte('submit_date', monthEnd);
      }
      
      const { data, error } = await query;

      if (error) throw error;
      
      if (data && data.length > 0) {
        return processCategoryRatingData(data);
      }
      
      // Return empty array if no data
      return [];
    } catch (error) {
      console.error('Error fetching category rating data:', error);
      return [];
    }
  };
  
  const processCategoryRatingData = (data: any[]): CategoryRatingDataPoint[] => {
    // Group by category and calculate average rating
    const categoryRatings: Record<string, { sum: number, count: number }> = {};
    
    data.forEach(item => {
      const category = item.category || 'Uncategorized';
      
      if (!categoryRatings[category]) {
        categoryRatings[category] = { sum: 0, count: 0 };
      }
      
      categoryRatings[category].sum += item.rating;
      categoryRatings[category].count++;
    });
    
    // Convert to array of data points
    const result: CategoryRatingDataPoint[] = Object.entries(categoryRatings)
      .map(([name, data]) => ({
        name,
        rating: data.count > 0 ? Number((data.sum / data.count).toFixed(1)) : 0
      }))
      .sort((a, b) => b.rating - a.rating);
    
    return result;
  };

  return {
    categoryRatingData,
    setCategoryRatingData,
    fetchCategoryRatingData
  };
};
