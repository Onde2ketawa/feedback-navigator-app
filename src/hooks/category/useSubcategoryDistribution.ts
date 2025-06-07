
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
      // First, get the category ID from the category name
      let categoryId = category;
      
      // If the category is not 'Uncategorized', fetch its ID
      if (category !== 'Uncategorized') {
        const { data: categoryData } = await supabase
          .from('categories')
          .select('id')
          .eq('name', category)
          .single();
        
        if (categoryData) {
          categoryId = categoryData.id;
        } else {
          console.warn(`Category not found: ${category}`);
          return [];
        }
      }

      // Use the Supabase function to get subcategory distribution
      const { data, error } = await supabase.rpc('get_subcategory_distribution', {
        category_param: categoryId,
        channel_id_param: selectedChannel === 'all' ? null : selectedChannel,
        year_param: selectedYear === 'all' ? null : selectedYear,
        month_param: selectedMonth === 'all' ? null : selectedMonth
      });
      
      if (error) throw error;
      
      console.log('Subcategory distribution raw data:', data);
      
      // Process the data to get proper subcategory names
      const processedData = await processSubcategoryData(data || [], categoryId);
      
      // Update the subcategory data state with the processed data
      setSubcategoryData(prev => ({
        ...prev,
        [category]: processedData
      }));
      
      return processedData;
    } catch (error) {
      console.error(`Error fetching subcategory distribution for ${category}:`, error);
      toast.error('Failed to load subcategory distribution data');
      return [];
    }
  };

  const processSubcategoryData = async (rawData: any[], categoryId: string): Promise<CategoryDataItem[]> => {
    if (!rawData || rawData.length === 0) return [];

    // Get all unique subcategory IDs from the data (excluding 'Unknown' and null values)
    const subcategoryIds = [...new Set(rawData.map(item => item.name).filter(id => id && id !== 'Unknown'))];
    
    let subcategoryNameMap: Record<string, string> = {};
    
    if (subcategoryIds.length > 0) {
      // Fetch subcategory names from the subcategories table
      const { data: subcategoriesData } = await supabase
        .from('subcategories')
        .select('id, name')
        .in('id', subcategoryIds)
        .eq('category_id', categoryId);
      
      if (subcategoriesData) {
        subcategoryNameMap = subcategoriesData.reduce((acc, subcat) => {
          acc[subcat.id] = subcat.name;
          return acc;
        }, {} as Record<string, string>);
      }
    }
    
    // Map the data to use proper subcategory names
    return rawData.map(item => ({
      name: subcategoryNameMap[item.name] || item.name || 'Unknown',
      value: item.value,
      color: item.color
    }));
  };

  return {
    subcategoryData,
    setSubcategoryData,
    fetchSubcategoryDistribution
  };
}
