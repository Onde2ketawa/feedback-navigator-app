
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define the data types
export interface CategoryDataItem {
  name: string;
  value: number;
  color: string;
}

export interface SubcategoryData {
  [key: string]: CategoryDataItem[];
}

export interface CategoryRating {
  name: string;
  rating: number;
}

export function useCategoryAnalyticsData() {
  // Define all the colors
  const COLORS = ['#8b5cf6', '#6366f1', '#ec4899', '#f43f5e', '#f97316', '#14b8a6', '#10b981', '#a3e635'];
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [categoryData, setCategoryData] = useState<CategoryDataItem[]>([]);
  const [subcategoryData, setSubcategoryData] = useState<SubcategoryData>({});
  const [categoryRatings, setCategoryRatings] = useState<CategoryRating[]>([]);
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  
  // Fetch data when filters change
  useEffect(() => {
    fetchCategoryAnalyticsData();
  }, [selectedChannel, selectedYear, selectedMonth, selectedCategory]);

  // Fetch category distribution data from Supabase
  const fetchCategoryDistribution = async () => {
    try {
      // Use the Supabase function to get category distribution
      const { data, error } = await supabase.rpc('get_category_distribution', {
        channel_id_param: selectedChannel,
        year_param: selectedYear,
        month_param: selectedMonth
      });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching category distribution:', error);
      toast.error('Failed to load category distribution data');
      return [];
    }
  };

  // Fetch subcategory distribution for a specific category
  const fetchSubcategoryDistribution = async (category: string) => {
    if (!category) return [];
    
    try {
      // Use the Supabase function to get subcategory distribution
      const { data, error } = await supabase.rpc('get_subcategory_distribution', {
        category_param: category,
        channel_id_param: selectedChannel,
        year_param: selectedYear,
        month_param: selectedMonth
      });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error(`Error fetching subcategory distribution for ${category}:`, error);
      toast.error('Failed to load subcategory distribution data');
      return [];
    }
  };

  // Fetch category ratings
  const fetchCategoryRatings = async () => {
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
      
      return result;
    } catch (error) {
      console.error('Error fetching category ratings:', error);
      toast.error('Failed to load category ratings data');
      return [];
    }
  };

  // Main function to fetch all data
  const fetchCategoryAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Fetch all data in parallel for better performance
      const [categoryDistribution, categoryRatingsData] = await Promise.all([
        fetchCategoryDistribution(),
        fetchCategoryRatings()
      ]);
      
      setCategoryData(categoryDistribution);
      setCategoryRatings(categoryRatingsData);
      
      // Update available categories
      const categories = categoryDistribution.map(item => item.name);
      setAvailableCategories(categories);
      
      // If a category is selected, fetch its subcategories
      if (selectedCategory) {
        const subcategoryDistribution = await fetchSubcategoryDistribution(selectedCategory);
        setSubcategoryData(prev => ({
          ...prev,
          [selectedCategory]: subcategoryDistribution
        }));
      } else if (categories.length > 0 && !selectedCategory) {
        // Select the first category by default if none is selected
        setSelectedCategory(categories[0]);
        const subcategoryDistribution = await fetchSubcategoryDistribution(categories[0]);
        setSubcategoryData(prev => ({
          ...prev,
          [categories[0]]: subcategoryDistribution
        }));
      }
    } catch (error) {
      console.error('Error fetching category analytics data:', error);
      toast.error('Failed to load analytics data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    categoryData,
    subcategoryData,
    availableCategories,
    categoryRatings,
    selectedChannel,
    setSelectedChannel,
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    selectedCategory,
    setSelectedCategory,
  };
}
