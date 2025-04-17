
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MonthlyRatingDataPoint } from './types';

export const useMonthlyRatingData = (
  channelFilter: string,
  yearFilter: string,
  monthFilter: string
) => {
  const [monthlyRatingData, setMonthlyRatingData] = useState<MonthlyRatingDataPoint[]>([]);

  const fetchMonthlyRatingData = async (): Promise<MonthlyRatingDataPoint[]> => {
    try {
      // Skip if no month is selected when a year is selected (except 'all')
      if (yearFilter !== 'all' && monthFilter === 'all') {
        console.log('Monthly chart: Year selected but no month. Using empty dataset.');
        return [];
      }
      
      // Select all feedback data with date information
      let query = supabase
        .from('customer_feedback')
        .select('submit_date, rating')
        .not('submit_date', 'is', null);
        
      // Apply filters based on selected options
      if (channelFilter !== 'all') {
        query = query.eq('channel_id', channelFilter);
      }
      
      // Add year filter if not 'all'
      if (yearFilter !== 'all') {
        const yearStart = `${yearFilter}-01-01`;
        const yearEnd = `${yearFilter}-12-31`;
        query = query.gte('submit_date', yearStart).lte('submit_date', yearEnd);
      }
      
      // Add month filter if not 'all'
      if (monthFilter !== 'all' && yearFilter !== 'all') {
        const monthNum = parseInt(monthFilter);
        const monthStr = monthNum < 10 ? `0${monthNum}` : `${monthNum}`;
        const monthStart = `${yearFilter}-${monthStr}-01`;
        const lastDay = new Date(parseInt(yearFilter), monthNum, 0).getDate();
        const monthEnd = `${yearFilter}-${monthStr}-${lastDay}`;
        query = query.gte('submit_date', monthStart).lte('submit_date', monthEnd);
      } else if (yearFilter === 'all' || monthFilter === 'all') {
        // For the monthly chart, we need both year and month selected
        console.log('Monthly chart: Need both year and month. Returning empty dataset.');
        return [];
      }
      
      // Execute the query
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        console.log(`Found ${data.length} ratings for monthly chart`);
        return processMonthlyRatingData(data);
      }
      
      console.log('No rating data found for monthly chart, using empty dataset');
      return [];
    } catch (error) {
      console.error('Error fetching monthly rating data:', error);
      return [];
    }
  };
  
  const processMonthlyRatingData = (data: any[]): MonthlyRatingDataPoint[] => {
    // Group by day of month and calculate average rating
    const dayRatings: Record<number, { sum: number, count: number }> = {};
    
    data.forEach(item => {
      if (!item.submit_date) return;
      
      const date = new Date(item.submit_date);
      const day = date.getDate();
      
      if (!dayRatings[day]) {
        dayRatings[day] = { sum: 0, count: 0 };
      }
      
      dayRatings[day].sum += item.rating;
      dayRatings[day].count++;
    });
    
    // Convert to array of data points
    const result: MonthlyRatingDataPoint[] = Object.entries(dayRatings).map(([day, data]) => ({
      day: parseInt(day),
      rating: data.count > 0 ? Number((data.sum / data.count).toFixed(1)) : 0
    }));
    
    // Sort by day and return
    return result.sort((a, b) => a.day - b.day);
  };

  return {
    monthlyRatingData,
    setMonthlyRatingData,
    fetchMonthlyRatingData
  };
};
