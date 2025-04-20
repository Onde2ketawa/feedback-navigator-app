
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { YoyTrendDataPoint } from './types';
import { yoyTrendData as defaultYoyTrendData } from '@/data/ratingsMockData';

export const useYoyTrendData = (channelFilter: string, yearFilter: string) => {
  const [yoyTrendData, setYoyTrendData] = useState<YoyTrendDataPoint[]>(defaultYoyTrendData);
  
  const fetchYoyTrendData = async (): Promise<YoyTrendDataPoint[]> => {
    try {
      console.log('Fetching YOY trend data with channelFilter:', channelFilter);
      
      // Instead of using rpc which requires database function declarations,
      // let's use a direct SQL query with supabase
      let query = supabase
        .from('customer_feedback')
        .select('submit_date, rating, channel_id, channel:channel_id(name)');
      
      // Add condition for channel filter
      if (channelFilter !== 'all') {
        query = query.eq('channel_id', channelFilter);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;

      console.log('Raw YOY data count:', data?.length);
      console.log('Sample raw data:', data?.slice(0, 3));
      
      if (data) return processYoyTrendData(data);
      
      return defaultYoyTrendData;
    } catch (error) {
      console.error('Error fetching YoY trend data:', error);
      return defaultYoyTrendData;
    }
  };
  
  const processYoyTrendData = (data: any[]): YoyTrendDataPoint[] => {
    // Process the data to get YoY trend
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;
    
    // Use English month names for consistency with the chart display
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Initialize result with all months and zero values
    const result: YoyTrendDataPoint[] = months.map(month => ({
      name: month,
      [`${currentYear}`]: 0,
      [`${previousYear}`]: 0,
      [`${currentYear}_count`]: 0, // To track number of ratings for average calculation
      [`${previousYear}_count`]: 0 // To track number of ratings for average calculation
    }));
    
    // Process data
    data.forEach(item => {
      if (!item.submit_date) return;
      
      const date = new Date(item.submit_date);
      const year = date.getFullYear();
      const monthIndex = date.getMonth();
      
      // Only process data for the current and previous year
      if (year === currentYear || year === previousYear) {
        const monthData = result[monthIndex];
        const yearKey = `${year}`;
        const countKey = `${yearKey}_count` as keyof typeof monthData;
        
        // Add the rating to the sum
        const currentVal = monthData[yearKey] as number || 0;
        const currentCount = (monthData[countKey] as number || 0) + 1;
        
        monthData[yearKey] = currentVal + Number(item.rating || 0);
        monthData[countKey] = currentCount;
      }
    });
    
    // Calculate averages
    result.forEach(monthData => {
      const currentYearKey = `${currentYear}`;
      const previousYearKey = `${previousYear}`;
      const currentYearCountKey = `${currentYear}_count` as keyof typeof monthData;
      const previousYearCountKey = `${previousYear}_count` as keyof typeof monthData;
      
      const currentYearCount = monthData[currentYearCountKey] as number;
      const previousYearCount = monthData[previousYearCountKey] as number;
      
      if (currentYearCount > 0) {
        monthData[currentYearKey] = Number((monthData[currentYearKey] as number / currentYearCount).toFixed(1));
      }
      
      if (previousYearCount > 0) {
        monthData[previousYearKey] = Number((monthData[previousYearKey] as number / previousYearCount).toFixed(1));
      }
      
      // Remove count properties as they are not needed for the chart
      delete monthData[currentYearCountKey];
      delete monthData[previousYearCountKey];
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
