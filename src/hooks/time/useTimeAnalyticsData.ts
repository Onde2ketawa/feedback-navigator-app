import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Type definitions
export interface TimeDistributionData {
  label: string;
  count: number;
  sortOrder?: number;
}

export interface CategoryTimeData {
  category: string;
  values: {
    timeLabel: string;
    count: number;
    sortOrder?: number;
  }[];
}

export interface DeviceTimeData {
  device: string;
  values: {
    timeLabel: string;
    count: number;
    sortOrder?: number;
  }[];
}

// Month ordering helper
const getMonthSortOrder = (monthName: string): number => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  // Find the month in the array and return its index (0-11)
  for (let i = 0; i < months.length; i++) {
    if (monthName.includes(months[i])) {
      return i;
    }
  }
  return 12; // Default for unknown months
};

export function useTimeAnalyticsData(
  channelFilter: string,
  yearFilter: string,
  monthFilter: string
) {
  const [monthlyDistribution, setMonthlyDistribution] = useState<TimeDistributionData[]>([]);
  const [dailyDistribution, setDailyDistribution] = useState<TimeDistributionData[]>([]);
  const [hourlyDistribution, setHourlyDistribution] = useState<TimeDistributionData[]>([]);
  const [categoryTimeData, setCategoryTimeData] = useState<CategoryTimeData[]>([]);
  const [deviceTimeData, setDeviceTimeData] = useState<DeviceTimeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTimeAnalyticsData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Build base query with common filters
        let baseQuery = supabase
          .from('customer_feedback')
          .select(`
            submit_date,
            submit_time,
            category,
            device,
            channel:channel_id(id, name)
          `);

        // Apply channel filter if selected
        if (channelFilter && channelFilter !== 'all') {
          try {
            const { data: channelData, error: channelError } = await supabase
              .from('channel')
              .select('id')
              .eq('name', channelFilter)
              .single();
            
            if (channelError) throw channelError;
            
            if (channelData) {
              baseQuery = baseQuery.eq('channel_id', channelData.id);
            }
          } catch (err) {
            console.error("Error finding channel:", err);
          }
        }

        // Apply year filter if selected
        if (yearFilter && yearFilter !== 'all') {
          const startOfYear = `${yearFilter}-01-01`;
          const endOfYear = `${parseInt(yearFilter) + 1}-01-01`;
          baseQuery = baseQuery.gte('submit_date', startOfYear).lt('submit_date', endOfYear);
        }

        // Apply month filter if selected (and year is selected)
        if (yearFilter && yearFilter !== 'all' && monthFilter && monthFilter !== 'all') {
          const month = parseInt(monthFilter);
          const year = parseInt(yearFilter);
          
          const startDate = new Date(year, month - 1, 1);
          const endDate = new Date(year, month, 0); // Last day of the month
          
          const startDateStr = startDate.toISOString().split('T')[0];
          const endDateStr = endDate.toISOString().split('T')[0];
          
          baseQuery = baseQuery.gte('submit_date', startDateStr).lte('submit_date', endDateStr);
        }

        // Fetch all feedback data with the applied filters
        const { data: feedbackData, error: feedbackError } = await baseQuery;
        
        if (feedbackError) throw feedbackError;
        
        if (!feedbackData || feedbackData.length === 0) {
          setMonthlyDistribution([]);
          setDailyDistribution([]);
          setHourlyDistribution([]);
          setCategoryTimeData([]);
          setDeviceTimeData([]);
          setIsLoading(false);
          return;
        }

        // Process data for monthly distribution
        const monthlyData: Record<string, number> = {};
        const hourlyData: Record<string, number> = {};
        const dailyData: Record<string, number> = {};
        const categoryByMonthData: Record<string, Record<string, number>> = {};
        const deviceByMonthData: Record<string, Record<string, number>> = {};
        
        // Process each feedback entry
        feedbackData.forEach(item => {
          if (item.submit_date) {
            // Extract date components
            const date = new Date(item.submit_date);
            const year = date.getFullYear();
            const month = date.getMonth() + 1; // JavaScript months are 0-indexed
            const day = date.getDate();
            
            // Format for monthly data (YYYY-MM)
            const monthKey = `${year}-${month.toString().padStart(2, '0')}`;
            monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
            
            // Format for daily data if month is selected (DD)
            if (monthFilter !== 'all') {
              const dayKey = day.toString().padStart(2, '0');
              dailyData[dayKey] = (dailyData[dayKey] || 0) + 1;
            }
            
            // Process category data by month
            const category = item.category || 'Uncategorized';
            if (!categoryByMonthData[category]) {
              categoryByMonthData[category] = {};
            }
            categoryByMonthData[category][monthKey] = (categoryByMonthData[category][monthKey] || 0) + 1;
            
            // Process device data by month
            const device = item.device || 'Unknown';
            if (!deviceByMonthData[device]) {
              deviceByMonthData[device] = {};
            }
            deviceByMonthData[device][monthKey] = (deviceByMonthData[device][monthKey] || 0) + 1;
          }
          
          // Process hourly data
          if (item.submit_time) {
            // Extract hour from time (format: HH:MM:SS)
            const hour = parseInt(item.submit_time.split(':')[0]);
            const hourKey = hour.toString().padStart(2, '0');
            hourlyData[hourKey] = (hourlyData[hourKey] || 0) + 1;
          }
        });
        
        // Convert monthly data to array format for charts with proper sorting
        const monthlyResult = Object.entries(monthlyData).map(([month, count]) => {
          const [year, monthNum] = month.split('-');
          const date = new Date(parseInt(year), parseInt(monthNum) - 1);
          const monthName = date.toLocaleString('default', { month: 'long' });
          const shortMonthName = date.toLocaleString('default', { month: 'short' });
          return {
            label: `${monthName} ${year}`,
            count,
            sortOrder: (parseInt(year) * 100) + parseInt(monthNum) // Year + month for sorting
          };
        }).sort((a, b) => a.sortOrder! - b.sortOrder!);
        
        // Convert daily data to array format for charts
        const dailyResult = Object.entries(dailyData).map(([day, count]) => {
          return {
            label: `Day ${day}`,
            count,
            sortOrder: parseInt(day)
          };
        }).sort((a, b) => a.sortOrder! - b.sortOrder!);
        
        // Convert hourly data to array format for charts
        const hourlyResult = Array.from({ length: 24 }, (_, i) => {
          const hour = i.toString().padStart(2, '0');
          return {
            label: `${hour}:00`,
            count: hourlyData[hour] || 0,
            sortOrder: i
          };
        });
        
        // Process category by time data with proper month sorting
        const categoryResult = Object.entries(categoryByMonthData).map(([category, monthData]) => {
          return {
            category,
            values: Object.entries(monthData).map(([month, count]) => {
              const [year, monthNum] = month.split('-');
              const date = new Date(parseInt(year), parseInt(monthNum) - 1);
              const monthName = date.toLocaleString('default', { month: 'short' });
              const timeLabel = `${monthName} ${year}`;
              return {
                timeLabel,
                count,
                sortOrder: (parseInt(year) * 100) + parseInt(monthNum) // Year + month for sorting
              };
            }).sort((a, b) => a.sortOrder! - b.sortOrder!)
          };
        });
        
        // Process device by time data with proper month sorting
        const deviceResult = Object.entries(deviceByMonthData).map(([device, monthData]) => {
          return {
            device,
            values: Object.entries(monthData).map(([month, count]) => {
              const [year, monthNum] = month.split('-');
              const date = new Date(parseInt(year), parseInt(monthNum) - 1);
              const monthName = date.toLocaleString('default', { month: 'short' });
              const timeLabel = `${monthName} ${year}`;
              return {
                timeLabel,
                count,
                sortOrder: (parseInt(year) * 100) + parseInt(monthNum) // Year + month for sorting
              };
            }).sort((a, b) => a.sortOrder! - b.sortOrder!)
          };
        });
        
        // Update state with processed data
        setMonthlyDistribution(monthlyResult);
        setDailyDistribution(dailyResult);
        setHourlyDistribution(hourlyResult);
        setCategoryTimeData(categoryResult);
        setDeviceTimeData(deviceResult);

      } catch (err) {
        console.error("Error fetching time analytics data:", err);
        setError(err instanceof Error ? err : new Error('Failed to fetch time analytics data'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimeAnalyticsData();
  }, [channelFilter, yearFilter, monthFilter]);

  return {
    monthlyDistribution,
    dailyDistribution,
    hourlyDistribution,
    categoryTimeData,
    deviceTimeData,
    isLoading,
    error
  };
}
