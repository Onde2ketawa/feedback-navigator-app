
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useCategoryDistribution } from './useCategoryDistribution';
import { useSubcategoryDistribution } from './useSubcategoryDistribution';
import { useCategoryRatings } from './useCategoryRatings';
import { useCategoryAnalyticsState } from './useCategoryAnalyticsState';
import { useCategoryTrend } from './useCategoryTrend';

// Re-export types from the types file
export * from './types';

export function useCategoryAnalyticsData() {
  // Define all the colors
  const COLORS = ['#8b5cf6', '#6366f1', '#ec4899', '#f43f5e', '#f97316', '#14b8a6', '#10b981', '#a3e635'];
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [ratingRange, setRatingRange] = useState<number[]>([1, 5]);
  
  // Use our existing hooks
  const { categoryData, setCategoryData, fetchCategoryDistribution } = useCategoryDistribution();
  const { subcategoryData, setSubcategoryData, fetchSubcategoryDistribution } = useSubcategoryDistribution();
  const { categoryRatings, setCategoryRatings, fetchCategoryRatings } = useCategoryRatings();
  const {
    selectedChannel,
    setSelectedChannel,
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    selectedCategory,
    setSelectedCategory,
    availableCategories,
    setAvailableCategories
  } = useCategoryAnalyticsState();

  // Add category trend hook
  const {
    categoryTrendData,
    availableCategories: trendCategories,
    selectedCategories: selectedTrendCategories,
    fetchCategoryTrend,
    toggleCategory
  } = useCategoryTrend();
  
  // Fetch data when filters change
  useEffect(() => {
    fetchCategoryAnalyticsData();
  }, [selectedChannel, selectedYear, selectedMonth, selectedCategory, ratingRange]);

  // Main function to fetch all data
  const fetchCategoryAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Fetch all data in parallel for better performance
      const [categoryDistribution, categoryRatingsData] = await Promise.all([
        fetchCategoryDistribution(selectedChannel, selectedYear, selectedMonth),
        fetchCategoryRatings(selectedChannel, selectedYear, selectedMonth),
        fetchCategoryTrend(selectedChannel, selectedYear, ratingRange[0], ratingRange[1])
      ]);
      
      // Update available categories
      const categories = categoryDistribution.map(item => item.name);
      setAvailableCategories(categories);
      
      // If a category is selected, fetch its subcategories
      if (selectedCategory) {
        await fetchSubcategoryDistribution(
          selectedCategory, 
          selectedChannel, 
          selectedYear, 
          selectedMonth
        );
      } else if (categories.length > 0) {
        // Select the first category by default if none is selected
        setSelectedCategory(categories[0]);
        await fetchSubcategoryDistribution(
          categories[0],
          selectedChannel,
          selectedYear,
          selectedMonth
        );
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
    categoryTrendData,
    availableCategories: trendCategories,
    selectedTrendCategories,
    ratingRange,
    selectedChannel,
    setSelectedChannel,
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    selectedCategory,
    setSelectedCategory,
    setRatingRange,
    toggleCategory,
  };
}
