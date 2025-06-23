
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CategoryTrendData {
  month: string;
  [key: string]: string | number;
}

export function useCategoryTrend() {
  const [categoryTrendData, setCategoryTrendData] = useState<CategoryTrendData[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const fetchCategoryTrend = useCallback(async (
    channelFilter: string,
    yearFilter: string,
    ratingMin: number = 1,
    ratingMax: number = 5
  ) => {
    try {
      console.log('Fetching category trend data with filters:', { channelFilter, yearFilter, ratingMin, ratingMax });

      let query = supabase
        .from('customer_feedback')
        .select(`
          submit_date,
          category,
          rating
        `)
        .gte('rating', ratingMin)
        .lte('rating', ratingMax);

      // Apply channel filter
      if (channelFilter && channelFilter !== 'all') {
        query = query.eq('channel_id', channelFilter);
      }

      // Apply year filter
      if (yearFilter && yearFilter !== 'all') {
        const startDate = `${yearFilter}-01-01`;
        const endDate = `${yearFilter}-12-31`;
        query = query.gte('submit_date', startDate).lte('submit_date', endDate);
      }

      const { data: feedbackData, error } = await query;

      if (error) {
        console.error('Error fetching category trend data:', error);
        throw error;
      }

      if (!feedbackData || feedbackData.length === 0) {
        console.log('No feedback data found for category trend');
        setCategoryTrendData([]);
        setAvailableCategories([]);
        return [];
      }

      // Get category names
      const categoryIds = [...new Set(feedbackData.map(item => item.category).filter(Boolean))];
      
      if (categoryIds.length === 0) {
        setCategoryTrendData([]);
        setAvailableCategories([]);
        return [];
      }

      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name')
        .in('id', categoryIds);

      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError);
        throw categoriesError;
      }

      const categoryMap = new Map();
      categoriesData?.forEach(cat => {
        categoryMap.set(cat.id, cat.name);
      });

      // Group data by month and category
      const monthlyTrends: { [key: string]: { [category: string]: number } } = {};
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      // Initialize all months
      months.forEach(month => {
        monthlyTrends[month] = {};
      });

      feedbackData.forEach(item => {
        if (item.submit_date && item.category) {
          const date = new Date(item.submit_date);
          const monthName = months[date.getMonth()];
          const categoryName = categoryMap.get(item.category) || 'Unknown';
          
          if (!monthlyTrends[monthName][categoryName]) {
            monthlyTrends[monthName][categoryName] = 0;
          }
          monthlyTrends[monthName][categoryName]++;
        }
      });

      // Get all unique categories
      const allCategories = new Set<string>();
      Object.values(monthlyTrends).forEach(monthData => {
        Object.keys(monthData).forEach(category => {
          allCategories.add(category);
        });
      });

      const categoriesList = Array.from(allCategories).sort();
      
      // Convert to chart format
      const chartData = months.map(month => {
        const monthData: CategoryTrendData = { month };
        categoriesList.forEach(category => {
          monthData[category] = monthlyTrends[month][category] || 0;
        });
        return monthData;
      });

      console.log('Category trend data processed:', chartData);
      
      setCategoryTrendData(chartData);
      setAvailableCategories(categoriesList);
      
      // Select top 3 categories by default
      const categoryTotals = categoriesList.map(category => ({
        category,
        total: chartData.reduce((sum, month) => sum + (month[category] as number || 0), 0)
      }));
      
      const topCategories = categoryTotals
        .sort((a, b) => b.total - a.total)
        .slice(0, 3)
        .map(item => item.category);
      
      setSelectedCategories(topCategories);
      
      return chartData;
    } catch (error) {
      console.error('Error in fetchCategoryTrend:', error);
      setCategoryTrendData([]);
      setAvailableCategories([]);
      setSelectedCategories([]);
      return [];
    }
  }, []);

  const toggleCategory = useCallback((category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  }, []);

  return {
    categoryTrendData,
    availableCategories,
    selectedCategories,
    fetchCategoryTrend,
    toggleCategory,
    setCategoryTrendData,
    setAvailableCategories,
    setSelectedCategories
  };
}
