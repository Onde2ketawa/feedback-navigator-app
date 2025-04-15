
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';

interface CategoryType {
  id: string;
  name: string;
}

interface SubcategoryType {
  id: string;
  category_id: string;
  name: string;
}

export const useCategoryQueries = () => {
  const { session } = useAuth();
  
  // Fetch categories from Supabase
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories', session?.user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
        
      if (error) throw error;
      return data as CategoryType[];
    },
    enabled: !!session
  });
  
  // Fetch subcategories from Supabase
  const { data: subcategories, isLoading: subcategoriesLoading } = useQuery({
    queryKey: ['subcategories', session?.user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subcategories')
        .select('*')
        .order('name');
        
      if (error) throw error;
      return data as SubcategoryType[];
    },
    enabled: !!session
  });

  // Helper to check if a category has subcategories
  const categoryHasSubcategories = (categoryId: string): boolean => {
    return subcategories?.some(sub => sub.category_id === categoryId) || false;
  };

  return {
    categories,
    subcategories,
    isLoading: categoriesLoading || subcategoriesLoading,
    categoryHasSubcategories
  };
};
