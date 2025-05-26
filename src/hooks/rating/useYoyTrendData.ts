
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { YoyTrendDataPoint } from './types';
import { yoyTrendData as defaultYoyTrendData } from '@/data/ratingsMockData';

export const useYoyTrendData = (channelFilter: string) => {
  const [yoyTrendData, setYoyTrendData] = useState<YoyTrendDataPoint[]>(defaultYoyTrendData);
  
  const fetchYoyTrendData = async (): Promise<YoyTrendDataPoint[]> => {
    try {
      console.log('Fetching YOY trend data with filters:', { channelFilter });
      
      let { data, error } = await supabase.rpc('get_yoy_rating_comparison', {
        channel_name: channelFilter === 'all' ? null : channelFilter
      });
      
      if (error) throw error;

      // Improved null and array checks
      if (!data || !Array.isArray(data)) {
        console.log('No data returned from database function');
        return generateEmptyYoyData();
      }

      console.log('Raw YOY data count:', data.length);
      console.log('Sample raw data:', data.slice(0, 3));
      
      if (data.length === 0) {
        return generateEmptyYoyData();
      }
      
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
    
    // Initialize monthly data structure with all months
    const monthlyData = months.map(month => ({
      name: month,
      [currentYear.toString()]: 0,
      [`${currentYear}_count`]: 0,
      [previousYear.toString()]: 0,
      [`${previousYear}_count`]: 0
    }));

    // Process each rating entry
    data.forEach(item => {
      const monthIndex = months.indexOf(item.month);
      const yearKey = item.year.toString();
      const countKey = `${yearKey}_count`;
      
      if (monthlyData[monthIndex]) {
        monthlyData[monthIndex][yearKey] = Number(item.avg_rating);
        monthlyData[monthIndex][countKey] = Number(item.rating_count);
      }
    });

    console.log('Processed YOY trend data:', monthlyData);
    return monthlyData;
  };

  return {
    yoyTrendData,
    setYoyTrendData,
    fetchYoyTrendData
  };
};
