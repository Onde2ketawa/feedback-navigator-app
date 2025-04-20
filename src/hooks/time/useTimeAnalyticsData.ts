
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TimeAnalyticsState } from './types';
import { buildTimeAnalyticsQuery } from './utils/timeQueryBuilder';
import {
  transformMonthlyData,
  transformDailyData,
  transformHourlyData,
  transformCategoryData,
  transformDeviceData
} from './utils/timeDataTransformers';

const initialState: TimeAnalyticsState = {
  monthlyDistribution: [],
  dailyDistribution: [],
  hourlyDistribution: [],
  categoryTimeData: [],
  deviceTimeData: [],
  isLoading: true,
  error: null
};

export function useTimeAnalyticsData(
  channelFilter: string,
  yearFilter: string,
  monthFilter: string
) {
  const [state, setState] = useState<TimeAnalyticsState>(initialState);

  useEffect(() => {
    const fetchTimeAnalyticsData = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        
        // Build and execute query
        const query = buildTimeAnalyticsQuery(supabase, channelFilter, yearFilter, monthFilter);
        const { data: feedbackData, error: feedbackError } = await query;
        
        if (feedbackError) throw feedbackError;
        
        if (!feedbackData || feedbackData.length === 0) {
          setState({ ...initialState, isLoading: false });
          return;
        }

        // Initialize data containers
        const monthlyData: Record<string, number> = {};
        const hourlyData: Record<string, number> = {};
        const dailyData: Record<string, number> = {};
        const categoryByMonthData: Record<string, Record<string, number>> = {};
        const deviceByMonthData: Record<string, Record<string, number>> = {};
        
        // Process each feedback entry
        feedbackData.forEach(item => {
          if (item.submit_date) {
            const date = new Date(item.submit_date);
            const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
            
            if (monthFilter !== 'all') {
              const day = date.getDate().toString().padStart(2, '0');
              dailyData[day] = (dailyData[day] || 0) + 1;
            }
            
            // Process category data
            const category = item.category || 'Uncategorized';
            if (!categoryByMonthData[category]) {
              categoryByMonthData[category] = {};
            }
            categoryByMonthData[category][monthKey] = (categoryByMonthData[category][monthKey] || 0) + 1;
            
            // Process device data
            const device = item.device || 'Unknown';
            if (!deviceByMonthData[device]) {
              deviceByMonthData[device] = {};
            }
            deviceByMonthData[device][monthKey] = (deviceByMonthData[device][monthKey] || 0) + 1;
          }
          
          if (item.submit_time) {
            const hour = item.submit_time.split(':')[0];
            hourlyData[hour] = (hourlyData[hour] || 0) + 1;
          }
        });

        // Transform all data using utility functions
        setState({
          monthlyDistribution: transformMonthlyData(monthlyData),
          dailyDistribution: transformDailyData(dailyData),
          hourlyDistribution: transformHourlyData(hourlyData),
          categoryTimeData: transformCategoryData(categoryByMonthData),
          deviceTimeData: transformDeviceData(deviceByMonthData),
          isLoading: false,
          error: null
        });

      } catch (err) {
        console.error("Error fetching time analytics data:", err);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err : new Error('Failed to fetch time analytics data')
        }));
      }
    };

    fetchTimeAnalyticsData();
  }, [channelFilter, yearFilter, monthFilter]);

  return state;
}

export type { TimeDistributionData, CategoryTimeData, DeviceTimeData } from './types';
