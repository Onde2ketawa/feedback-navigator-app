
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { YoyTrendDataPoint } from './types';
import { yoyTrendData as defaultYoyTrendData } from '@/data/ratingsMockData';

export const useYoyTrendData = (channelFilter: string, yearFilter: string) => {
  const [yoyTrendData, setYoyTrendData] = useState<YoyTrendDataPoint[]>(defaultYoyTrendData);
  
  const fetchYoyTrendData = async (): Promise<YoyTrendDataPoint[]> => {
    try {
      console.log('Fetching YOY trend data with filters:', { channelFilter, yearFilter });
      
      let query = supabase
        .from('customer_feedback')
        .select('submit_date, rating, channel_id');
      
      // Add channel filter if not 'all'
      if (channelFilter !== 'all') {
        query = query.eq('channel_id', channelFilter);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;

      console.log('Raw YOY data count:', data?.length);
      console.log('Sample raw data:', data?.slice(0, 3));
      
      if (!data) return generateEmptyYoyData();
      
      return processYoyTrendData(data);
    } catch (error) {
      console.error('Error fetching YoY trend data:', error);
      return generateEmptyYoyData();
    }
  };
  
  const generateEmptyYoyData = (): YoyTrendDataPoint[] => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;
    
    return months.map(month => ({
      name: month,
      [currentYear.toString()]: 0,
      [`${currentYear}_count`]: 0,
      [previousYear.toString()]: 0,
      [`${previousYear}_count`]: 0
    }));
  };
  
  const processYoyTrendData = (data: any[]): YoyTrendDataPoint[] => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;
    
    // Initialize result with all months
    const result = months.map(month => ({
      name: month,
      [currentYear.toString()]: 0,
      [`${currentYear}_count`]: 0,
      [previousYear.toString()]: 0,
      [`${previousYear}_count`]: 0
    }));

    // Process each feedback entry
    data.forEach(item => {
      if (!item.submit_date) return;
      
      const date = new Date(item.submit_date);
      const year = date.getFullYear();
      const monthIndex = date.getMonth();
      
      // Only process data for current and previous year
      if (year === currentYear || year === previousYear) {
        const yearKey = year.toString();
        const countKey = `${yearKey}_count`;
        const monthData = result[monthIndex];
        
        // Add rating to the sum and increment count
        const currentRating = monthData[yearKey] as number || 0;
        const currentCount = (monthData[countKey] as number || 0) + 1;
        
        monthData[yearKey] = currentRating + Number(item.rating || 0);
        monthData[countKey] = currentCount;
      }
    });

    // Calculate averages
    result.forEach(monthData => {
      const currentYearKey = currentYear.toString();
      const previousYearKey = previousYear.toString();
      const currentYearCount = monthData[`${currentYearKey}_count`] as number;
      const previousYearCount = monthData[`${previousYearKey}_count`] as number;
      
      if (currentYearCount > 0) {
        monthData[currentYearKey] = Number((monthData[currentYearKey] as number / currentYearCount).toFixed(1));
      }
      
      if (previousYearCount > 0) {
        monthData[previousYearKey] = Number((monthData[previousYearKey] as number / previousYearCount).toFixed(1));
      }
      
      // Remove count properties as they're not needed for the chart
      delete monthData[`${currentYearKey}_count`];
      delete monthData[`${previousYearKey}_count`];
    });

    console.log('Processed YOY trend data:', result);
    return result;
  };

  return {
    yoyTrendData,
    setYoyTrendData,
    fetchYoyTrendData
  };
};
