
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CategoryDataItem, SubcategoryData } from './types';

export function useSubcategoryDistribution() {
  const [subcategoryData, setSubcategoryData] = useState<SubcategoryData>({});

  const fetchSubcategoryDistribution = async (
    category: string,
    selectedChannel: string,
    selectedYear: string,
    selectedMonth: string
  ): Promise<CategoryDataItem[]> => {
    if (!category) return [];
    
    try {
      // Use the Supabase function to get subcategory distribution
      const { data, error } = await supabase.rpc('get_subcategory_distribution', {
        category_param: category,
        channel_id_param: selectedChannel === 'all' ? null : selectedChannel,
        year_param: selectedYear === 'all' ? null : selectedYear,
        month_param: selectedMonth === 'all' ? null : selectedMonth
      });
      
      if (error) throw error;
      
      // Update the subcategory data state with the new data
      setSubcategoryData(prev => ({
        ...prev,
        [category]: data || []
      }));
      
      return data || [];
    } catch (error) {
      console.error(`Error fetching subcategory distribution for ${category}:`, error);
      toast.error('Failed to load subcategory distribution data');
      return [];
    }
  };

  return {
    subcategoryData,
    setSubcategoryData,
    fetchSubcategoryDistribution
  };
}
