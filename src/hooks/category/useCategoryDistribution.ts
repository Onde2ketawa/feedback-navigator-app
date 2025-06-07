
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
      
      // The RPC function already returns name, value, and color
      // But we need to make sure we're getting actual category names, not IDs
      const processedData = await processCategoryData(data || []);
      
      setCategoryData(processedData);
      return processedData;
    } catch (error) {
      console.error('Error fetching category distribution:', error);
      toast.error('Failed to load category distribution data');
      return [];
    }
  };

  const processCategoryData = async (rawData: any[]): Promise<CategoryDataItem[]> => {
    // Get all unique category IDs from the data
    const categoryIds = [...new Set(rawData.map(item => item.name).filter(id => id && id !== 'Uncategorized'))];
    
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
    
    // Map the data to use proper category names
    return rawData.map(item => ({
      name: categoryNameMap[item.name] || item.name || 'Uncategorized',
      value: item.value,
      color: item.color
    }));
  };

  return {
    categoryData,
    setCategoryData,
    fetchCategoryDistribution
  };
}
