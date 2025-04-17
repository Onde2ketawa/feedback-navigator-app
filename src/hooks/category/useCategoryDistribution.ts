
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CategoryDataItem } from './types';

export function useCategoryDistribution() {
  const [categoryData, setCategoryData] = useState<CategoryDataItem[]>([]);

  const fetchCategoryDistribution = async (
    selectedChannel: string,
    selectedYear: string,
    selectedMonth: string
  ): Promise<CategoryDataItem[]> => {
    try {
      // Use the Supabase function to get category distribution
      const { data, error } = await supabase.rpc('get_category_distribution', {
        channel_id_param: selectedChannel === 'all' ? null : selectedChannel,
        year_param: selectedYear === 'all' ? null : selectedYear,
        month_param: selectedMonth === 'all' ? null : selectedMonth
      });
      
      if (error) throw error;
      
      setCategoryData(data || []);
      return data || [];
    } catch (error) {
      console.error('Error fetching category distribution:', error);
      toast.error('Failed to load category distribution data');
      return [];
    }
  };

  return {
    categoryData,
    setCategoryData,
    fetchCategoryDistribution
  };
}
