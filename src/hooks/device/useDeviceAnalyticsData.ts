
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface DeviceDistribution {
  device: string;
  count: number;
}

export interface DeviceCategoryData {
  device: string;
  category: string;
  count: number;
}

export interface DeviceRatingData {
  device: string;
  averageRating: number;
  totalFeedback: number;
}

export function useDeviceAnalyticsData(
  channelFilter: string,
  yearFilter: string,
  monthFilter: string
) {
  const { session } = useAuth();

  return useQuery({
    queryKey: ['deviceAnalytics', channelFilter, yearFilter, monthFilter, session?.user.id],
    queryFn: async () => {
      let query = supabase
        .from('customer_feedback')
        .select(`
          device,
          rating,
          category,
          channel:channel_id(id, name)
        `)
        .not('device', 'eq', '');

      // Apply filters
      if (channelFilter !== 'all') {
        query = query.eq('channel_id', channelFilter);
      }

      if (yearFilter !== 'all') {
        query = query.gte('submit_date', `${yearFilter}-01-01`)
                    .lt('submit_date', `${parseInt(yearFilter) + 1}-01-01`);

        if (monthFilter !== 'all') {
          const month = parseInt(monthFilter);
          const startDate = new Date(parseInt(yearFilter), month - 1, 1);
          const endDate = new Date(parseInt(yearFilter), month, 0);
          query = query.gte('submit_date', startDate.toISOString())
                      .lte('submit_date', endDate.toISOString());
        }
      }

      const { data, error } = await query;

      if (error) throw error;

      // Get all unique category IDs from the feedback data
      const categoryIds = [...new Set(data.map(item => item.category).filter(id => id && id !== 'Uncategorized'))];
      
      let categoryNameMap: Record<string, string> = {};
      
      if (categoryIds.length > 0) {
        // Fetch category names from the categories table
        const { data: categoriesData } = await supabase
          .from('categories')
          .select('id, name')
          .in('id', categoryIds);
        
        if (categoriesData) {
          categoryNameMap = categoriesData.reduce((acc, cat) => {
            acc[cat.id] = cat.name;
            return acc;
          }, {} as Record<string, string>);
        }
      }

      // Process data for device distribution
      const deviceDistribution: DeviceDistribution[] = Object.entries(
        data.reduce((acc: Record<string, number>, item) => {
          acc[item.device] = (acc[item.device] || 0) + 1;
          return acc;
        }, {})
      ).map(([device, count]) => ({ device, count }));

      // Process data for device-category comparison with proper category names
      const deviceCategoryData: DeviceCategoryData[] = data.reduce((acc: DeviceCategoryData[], item) => {
        const categoryName = categoryNameMap[item.category] || item.category || 'Uncategorized';
        const existingEntry = acc.find(entry => 
          entry.device === item.device && entry.category === categoryName
        );

        if (existingEntry) {
          existingEntry.count++;
        } else {
          acc.push({
            device: item.device,
            category: categoryName,
            count: 1
          });
        }
        return acc;
      }, []);

      // Process data for device-rating comparison
      const deviceRatings = data.reduce((acc: Record<string, { total: number, count: number }>, item) => {
        if (!acc[item.device]) {
          acc[item.device] = { total: 0, count: 0 };
        }
        acc[item.device].total += item.rating;
        acc[item.device].count++;
        return acc;
      }, {});

      const deviceRatingData: DeviceRatingData[] = Object.entries(deviceRatings).map(
        ([device, { total, count }]) => ({
          device,
          averageRating: total / count,
          totalFeedback: count
        })
      );

      return {
        deviceDistribution,
        deviceCategoryData,
        deviceRatingData
      };
    },
    enabled: !!session
  });
}
