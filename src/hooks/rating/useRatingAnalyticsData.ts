
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { yoyTrendData as defaultYoyTrendData, ratingDistributionData as defaultRatingDistributionData } from '@/data/ratingsMockData';
import { toast } from 'sonner';

interface YoyTrendDataPoint {
  name: string;
  [key: string]: number | string;
}

interface RatingDistributionDataPoint {
  rating: string;
  count: number;
  color: string;
}

interface MonthlyRatingDataPoint {
  day: number;
  rating: number;
}

interface CategoryRatingDataPoint {
  name: string;
  rating: number;
}

export function useRatingAnalyticsData() {
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('2024');
  const [monthFilter, setMonthFilter] = useState<string>('all');
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [yoyTrendData, setYoyTrendData] = useState<YoyTrendDataPoint[]>(defaultYoyTrendData);
  const [ratingDistributionData, setRatingDistributionData] = useState<RatingDistributionDataPoint[]>(defaultRatingDistributionData);
  const [monthlyRatingData, setMonthlyRatingData] = useState<MonthlyRatingDataPoint[]>([]);
  const [categoryRatingData, setCategoryRatingData] = useState<CategoryRatingDataPoint[]>([]);

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

  const fetchYoyTrendData = async (): Promise<YoyTrendDataPoint[]> => {
    try {
      const { data, error } = await supabase.rpc('get_yoy_rating_trend', {
        channel_id_param: channelFilter,
        year_param: yearFilter
      });

      if (error) throw error;
      
      if (data && data.length > 0) {
        // Transform data to format expected by chart
        return data.map(item => ({
          name: item.month,
          "Current Year": Number(item["Current Year"]),
          "Previous Year": Number(item["Previous Year"])
        }));
      }
      
      return defaultYoyTrendData;
    } catch (error) {
      console.error('Error fetching YoY trend data:', error);
      return defaultYoyTrendData;
    }
  };

  const fetchRatingDistributionData = async (): Promise<RatingDistributionDataPoint[]> => {
    try {
      const { data, error } = await supabase.rpc('get_rating_distribution', {
        channel_id_param: channelFilter,
        year_param: yearFilter,
        month_param: monthFilter
      });

      if (error) throw error;
      
      if (data && data.length > 0) {
        // Transform data to format expected by chart
        return data.map(item => ({
          rating: `${item.rating} Star${item.rating !== 1 ? 's' : ''}`,
          count: Number(item.value),
          color: item.color
        }));
      }
      
      return defaultRatingDistributionData;
    } catch (error) {
      console.error('Error fetching rating distribution data:', error);
      return defaultRatingDistributionData;
    }
  };

  const fetchMonthlyRatingData = async (): Promise<MonthlyRatingDataPoint[]> => {
    try {
      const { data, error } = await supabase.rpc('get_monthly_rating_trend', {
        channel_id_param: channelFilter,
        year_param: yearFilter
      });

      if (error) throw error;
      
      if (data && data.length > 0) {
        // Transform data to format expected by chart
        return data.map(item => ({
          day: Number(item.day),
          rating: Number(item.rating)
        }));
      }
      
      // Return empty array if no data
      return [];
    } catch (error) {
      console.error('Error fetching monthly rating data:', error);
      return [];
    }
  };

  const fetchCategoryRatingData = async (): Promise<CategoryRatingDataPoint[]> => {
    try {
      const { data, error } = await supabase.rpc('get_category_ratings', {
        channel_id_param: channelFilter,
        year_param: yearFilter,
        month_param: monthFilter
      });

      if (error) throw error;
      
      if (data && data.length > 0) {
        // Transform data to format expected by chart
        return data.map(item => ({
          name: item.name,
          rating: Number(item.rating)
        }));
      }
      
      // Return empty array if no data
      return [];
    } catch (error) {
      console.error('Error fetching category rating data:', error);
      return [];
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
