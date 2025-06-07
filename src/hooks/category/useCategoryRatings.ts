
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
      
      console.log('Raw category ratings data:', data?.slice(0, 5));
      
      // Group by category and calculate average rating
      const categoryRatingsMap: { [key: string]: { sum: number; count: number } } = {};
      
      data?.forEach(item => {
        const category = item.category || 'Uncategorized';
        
        // Parse rating properly to ensure it's a valid number
        let rating: number;
        
        if (typeof item.rating === 'number') {
          rating = item.rating;
        } else if (typeof item.rating === 'string') {
          rating = parseFloat(item.rating);
        } else {
          console.warn(`Invalid rating type for ${category}:`, typeof item.rating);
          return; // Skip invalid ratings
        }
        
        if (isNaN(rating) || rating < 1 || rating > 5) {
          console.warn(`Invalid rating value for ${category}:`, item.rating);
          return; // Skip invalid ratings
        }
        
        if (!categoryRatingsMap[category]) {
          categoryRatingsMap[category] = { sum: 0, count: 0 };
        }
        
        categoryRatingsMap[category].sum += rating;
        categoryRatingsMap[category].count++;
      });
      
      // Calculate averages and prepare result with category IDs
      const categoryRatingsWithIds: { categoryId: string; rating: number }[] = Object.keys(categoryRatingsMap).map(category => ({
        categoryId: category,
        rating: Number((categoryRatingsMap[category].sum / categoryRatingsMap[category].count).toFixed(1))
      }));
      
      // Get all unique category IDs (excluding 'Uncategorized')
      const categoryIds = categoryRatingsWithIds
        .map(item => item.categoryId)
        .filter(id => id && id !== 'Uncategorized');
      
      let categoryNameMap: Record<string, string> = {};
      
      if (categoryIds.length > 0) {
        // Fetch category names from the categories table
        const { data: categoriesData } = await supabase
          .from('categories')
          .select('id, name')
          .in('id', categoryIds);
        
        if (categoriesData) {
          categoryNameMap = categoriesData.reduce((acc, cat) => {
            acc[cat.id] = cat.name;
            return acc;
          }, {} as Record<string, string>);
        }
      }
      
      // Map the data to use proper category names
      const result: CategoryRating[] = categoryRatingsWithIds.map(item => ({
        name: categoryNameMap[item.categoryId] || item.categoryId || 'Uncategorized',
        rating: item.rating
      }));
      
      // Sort by rating, descending
      result.sort((a, b) => b.rating - a.rating);
      
      console.log('Processed category ratings with names:', result);
      
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
