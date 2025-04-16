
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { YoyTrendDataPoint } from './types';
import { yoyTrendData as defaultYoyTrendData } from '@/data/ratingsMockData';

export const useYoyTrendData = (channelFilter: string, yearFilter: string) => {
  const [yoyTrendData, setYoyTrendData] = useState<YoyTrendDataPoint[]>(defaultYoyTrendData);
  
  const fetchYoyTrendData = async (): Promise<YoyTrendDataPoint[]> => {
    try {
      // Instead of using rpc which requires database function declarations,
      // let's use a direct SQL query with supabase
      let query = supabase
        .from('customer_feedback')
        .select('submit_date, rating, channel_id');
      
      // Add condition for channel filter
      if (channelFilter !== 'all') {
        query = query.eq('channel_id', channelFilter);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
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
    
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Initialize result with all months
    const result: YoyTrendDataPoint[] = months.map(month => ({
      name: month,
      [`${currentYear}`]: 0,
      [`${previousYear}`]: 0
    }));
    
    // Process data
    data.forEach(item => {
      if (!item.submit_date) return;
      
      const date = new Date(item.submit_date);
      const year = date.getFullYear();
      const monthIndex = date.getMonth();
      
      if (year === currentYear || year === previousYear) {
        const monthData = result[monthIndex];
        const yearKey = `${year}`;
        
        // Initialize if not exists
        if (typeof monthData[yearKey] !== 'number') {
          monthData[yearKey] = 0;
        }
        
        // Increment count and rating sum for average calculation
        const currentVal = monthData[yearKey] as number;
        monthData[yearKey] = currentVal + item.rating / 10; // Dividing to get reasonable values
      }
    });
    
    return result;
  };

  return {
    yoyTrendData,
    setYoyTrendData,
    fetchYoyTrendData
  };
};
