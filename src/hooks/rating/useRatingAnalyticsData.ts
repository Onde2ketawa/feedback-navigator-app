
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useYoyTrendData } from './useYoyTrendData';
import { useRatingDistributionData } from './useRatingDistributionData';
import { useMonthlyRatingData } from './useMonthlyRatingData';
import { useCategoryRatingData } from './useCategoryRatingData';

// Re-export types
export * from './types';

export function useRatingAnalyticsData() {
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('2024');
  const [monthFilter, setMonthFilter] = useState<string>('all');
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Use the extracted hooks
  const { yoyTrendData, setYoyTrendData, fetchYoyTrendData } = 
    useYoyTrendData(channelFilter, yearFilter);
  
  const { ratingDistributionData, setRatingDistributionData, fetchRatingDistributionData } = 
    useRatingDistributionData(channelFilter);
  
  const { monthlyRatingData, setMonthlyRatingData, fetchMonthlyRatingData } = 
    useMonthlyRatingData(channelFilter, yearFilter, monthFilter);
  
  const { categoryRatingData, setCategoryRatingData, fetchCategoryRatingData } = 
    useCategoryRatingData(channelFilter, yearFilter, monthFilter);

  // Fetch data when filters change
  useEffect(() => {
    fetchRatingAnalyticsData();
  }, [channelFilter, yearFilter, monthFilter]);

  const fetchRatingAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Fetch data in parallel for better performance
      const [yoyData, distributionData, monthlyData, categoryData] = await Promise.all([
        fetchYoyTrendData(),
        fetchRatingDistributionData(),
        fetchMonthlyRatingData(),
        fetchCategoryRatingData()
      ]);

      // Only update state if the component is still mounted
      setYoyTrendData(yoyData);
      setRatingDistributionData(distributionData);
      setMonthlyRatingData(monthlyData);
      setCategoryRatingData(categoryData);
      
    } catch (error) {
      console.error('Error fetching rating analytics data:', error);
      toast.error('Failed to load analytics data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    channelFilter,
    setChannelFilter,
    yearFilter,
    setYearFilter,
    monthFilter,
    setMonthFilter,
    isLoading,
    yoyTrendData,
    ratingDistributionData,
    monthlyRatingData,
    categoryRatingData,
    refreshData: fetchRatingAnalyticsData
  };
}
