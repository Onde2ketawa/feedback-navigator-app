
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CategoryRating } from './types';

export function useCategoryRatings() {
  const [categoryRatings, setCategoryRatings] = useState<CategoryRating[]>([]);

  const fetchCategoryRatings = async (
    selectedChannel: string,
    selectedYear: string,
    selectedMonth: string
  ): Promise<CategoryRating[]> => {
    try {
      // Fetch all feedback data with category and rating
      let query = supabase
        .from('customer_feedback')
        .select('category, rating')
        .not('category', 'is', null);
      
      // Apply filters
      if (selectedChannel !== 'all') {
        query = query.eq('channel_id', selectedChannel);
      }
      
      if (selectedYear !== 'all') {
        const yearStart = `${selectedYear}-01-01`;
        const yearEnd = `${selectedYear}-12-31`;
        query = query.gte('submit_date', yearStart).lte('submit_date', yearEnd);
      }
      
      if (selectedMonth !== 'all' && selectedYear !== 'all') {
        const monthNum = parseInt(selectedMonth);
        const monthStr = monthNum < 10 ? `0${monthNum}` : `${monthNum}`;
        const monthStart = `${selectedYear}-${monthStr}-01`;
        const lastDay = new Date(parseInt(selectedYear), monthNum, 0).getDate();
        const monthEnd = `${selectedYear}-${monthStr}-${lastDay}`;
        query = query.gte('submit_date', monthStart).lte('submit_date', monthEnd);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Group by category and calculate average rating
      const categoryRatingsMap: { [key: string]: { sum: number; count: number } } = {};
      
      data?.forEach(item => {
        const category = item.category || 'Uncategorized';
        
        if (!categoryRatingsMap[category]) {
          categoryRatingsMap[category] = { sum: 0, count: 0 };
        }
        
        categoryRatingsMap[category].sum += item.rating;
        categoryRatingsMap[category].count++;
      });
      
      // Calculate averages
      const result: CategoryRating[] = Object.keys(categoryRatingsMap).map(category => ({
        name: category,
        rating: Number((categoryRatingsMap[category].sum / categoryRatingsMap[category].count).toFixed(1))
      }));
      
      // Sort by rating, descending
      result.sort((a, b) => b.rating - a.rating);
      
      setCategoryRatings(result);
      return result;
    } catch (error) {
      console.error('Error fetching category ratings:', error);
      toast.error('Failed to load category ratings data');
      return [];
    }
  };

  return {
    categoryRatings,
    setCategoryRatings,
    fetchCategoryRatings
  };
}
