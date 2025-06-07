
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
      
      console.log('Subcategory distribution data:', data);
      
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
