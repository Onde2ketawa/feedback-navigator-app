
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useYoyTrendData } from './useYoyTrendData';
import { useRatingDistributionData } from './useRatingDistributionData';
import { useCategoryRatingData } from './useCategoryRatingData';

export * from './types';

export function useRatingAnalyticsData(channelFilter: string) {
  const [yearFilter, setYearFilter] = useState<string>('2025');
  const [monthFilter, setMonthFilter] = useState<string>('all');
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const { yoyTrendData, setYoyTrendData, fetchYoyTrendData } = 
    useYoyTrendData(channelFilter);
  
  const { ratingDistributionData, setRatingDistributionData, fetchRatingDistributionData } = 
    useRatingDistributionData(channelFilter);
  
  const { categoryRatingData, setCategoryRatingData, fetchCategoryRatingData } = 
    useCategoryRatingData(channelFilter, yearFilter, monthFilter);

  useEffect(() => {
    console.log("useRatingAnalyticsData effect with filters:", { channelFilter, yearFilter, monthFilter });
    fetchRatingAnalyticsData();
  }, [channelFilter, yearFilter, monthFilter]);

  const fetchRatingAnalyticsData = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching all rating analytics data...");
      const [yoyData, distributionData, categoryData] = await Promise.all([
        fetchYoyTrendData(),
        fetchRatingDistributionData(),
        fetchCategoryRatingData()
      ]);

      setYoyTrendData(yoyData);
      setRatingDistributionData(distributionData);
      setCategoryRatingData(categoryData);
      
    } catch (error) {
      console.error('Error fetching rating analytics data:', error);
      toast.error('Failed to load analytics data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    yearFilter,
    setYearFilter,
    monthFilter,
    setMonthFilter,
    isLoading,
    yoyTrendData,
    ratingDistributionData,
    categoryRatingData,
    refreshData: fetchRatingAnalyticsData
  };
}
