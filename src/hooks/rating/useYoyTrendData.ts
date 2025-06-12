
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { YoyTrendDataPoint } from './types';
import { yoyTrendData as defaultYoyTrendData } from '@/data/ratingsMockData';

export const useYoyTrendData = (channelFilter: string) => {
  const [yoyTrendData, setYoyTrendData] = useState<YoyTrendDataPoint[]>(defaultYoyTrendData);
  
  const fetchYoyTrendData = async (): Promise<YoyTrendDataPoint[]> => {
    try {
      console.log('[YoyTrend] Fetching YOY trend data with channel filter:', channelFilter);
      
      // Get the channel name from the channel ID if needed
      let channelName: string | null = null;
      
      if (channelFilter !== 'all') {
        const { data: channelData, error: channelError } = await supabase
          .from('channel')
          .select('name')
          .eq('id', channelFilter)
          .single();
          
        if (channelError) {
          console.error('[YoyTrend] Error fetching channel name:', channelError);
          return generateEmptyYoyData();
        }
        
        channelName = channelData?.name || null;
        console.log(`[YoyTrend] Resolved channel ID ${channelFilter} to name:`, channelName);
      }
      
      let { data, error } = await supabase.rpc('get_yoy_rating_comparison', {
        channel_name: channelName
      });
      
      if (error) {
        console.error('[YoyTrend] Error fetching data:', error);
        throw error;
      }

      // Type the data properly and handle null/undefined cases
      const validData: any[] = data || [];
      
      if (!Array.isArray(validData)) {
        console.log('[YoyTrend] Data is not an array, using empty data');
        return generateEmptyYoyData();
      }

      console.log('[YoyTrend] Raw YOY data count:', validData.length);
      console.log('[YoyTrend] Sample raw data:', validData.slice(0, 3));
      
      if (validData.length === 0) {
        return generateEmptyYoyData();
      }
      
      return processYoyTrendData(validData);
    } catch (error) {
      console.error('[YoyTrend] Error fetching YoY trend data:', error);
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

    console.log('[YoyTrend] Processed YOY trend data:', monthlyData);
    return monthlyData;
  };

  return {
    yoyTrendData,
    setYoyTrendData,
    fetchYoyTrendData
  };
};
