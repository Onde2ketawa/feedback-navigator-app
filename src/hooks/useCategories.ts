
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';
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

export const useCategories = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { session, isAdmin } = useAuth();
  
  // State for selected items
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<SubcategoryType | null>(null);
  
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
  
  // Add category mutation
  const addCategoryMutation = useMutation({
    mutationFn: async (categoryName: string) => {
      if (!isAdmin) {
        throw new Error("You don't have permission to add categories.");
      }
      
      const { data, error } = await supabase
        .from('categories')
        .insert([{ name: categoryName }])
        .select();
        
      if (error) throw error;
      return data;
    },
    onSuccess: (_, categoryName) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      
      toast({
        title: "Category added",
        description: `"${categoryName}" has been added successfully.`,
      });
    },
    onError: (error) => {
      console.error('Error adding category:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add category. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Edit category mutation
  const editCategoryMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      if (!isAdmin) {
        throw new Error("You don't have permission to edit categories.");
      }
      
      const { data, error } = await supabase
        .from('categories')
        .update({ name })
        .eq('id', id)
        .select();
        
      if (error) throw error;
      return data;
    },
    onSuccess: (_, { name }) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      
      toast({
        title: "Category updated",
        description: `Category has been updated to "${name}".`,
      });
    },
    onError: (error) => {
      console.error('Error updating category:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update category. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!isAdmin) {
        throw new Error("You don't have permission to delete categories.");
      }
      
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['subcategories'] });
      
      const categoryToDelete = categories?.find(cat => cat.id === id);
      
      toast({
        title: "Category deleted",
        description: `"${categoryToDelete?.name}" has been deleted.`,
      });
    },
    onError: (error) => {
      console.error('Error deleting category:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete category. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Add subcategory mutation
  const addSubcategoryMutation = useMutation({
    mutationFn: async ({ categoryId, name }: { categoryId: string; name: string }) => {
      if (!isAdmin) {
        throw new Error("You don't have permission to add subcategories.");
      }
      
      const { data, error } = await supabase
        .from('subcategories')
        .insert([{ 
          category_id: categoryId, 
          name 
        }])
        .select();
        
      if (error) throw error;
      return data;
    },
    onSuccess: (_, { name }) => {
      queryClient.invalidateQueries({ queryKey: ['subcategories'] });
      
      toast({
        title: "Subcategory added",
        description: `"${name}" has been added.`,
      });
    },
    onError: (error) => {
      console.error('Error adding subcategory:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add subcategory. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Edit subcategory mutation
  const editSubcategoryMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      if (!isAdmin) {
        throw new Error("You don't have permission to edit subcategories.");
      }
      
      const { data, error } = await supabase
        .from('subcategories')
        .update({ name })
        .eq('id', id)
        .select();
        
      if (error) throw error;
      return data;
    },
    onSuccess: (_, { name }) => {
      queryClient.invalidateQueries({ queryKey: ['subcategories'] });
      
      toast({
        title: "Subcategory updated",
        description: `Subcategory has been updated to "${name}".`,
      });
    },
    onError: (error) => {
      console.error('Error updating subcategory:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update subcategory. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Delete subcategory mutation
  const deleteSubcategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!isAdmin) {
        throw new Error("You don't have permission to delete subcategories.");
      }
      
      const { error } = await supabase
        .from('subcategories')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['subcategories'] });
      
      const subcategoryToDelete = subcategories?.find(sub => sub.id === id);
      
      toast({
        title: "Subcategory deleted",
        description: `"${subcategoryToDelete?.name}" has been deleted.`,
      });
    },
    onError: (error) => {
      console.error('Error deleting subcategory:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete subcategory. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Helper to check if a category has subcategories
  const categoryHasSubcategories = (categoryId: string): boolean => {
    return subcategories?.some(sub => sub.category_id === categoryId) || false;
  };

  return {
    // Data
    categories,
    subcategories,
    isLoading: categoriesLoading || subcategoriesLoading,
    
    // Selected states
    selectedCategory,
    setSelectedCategory,
    selectedSubcategory,
    setSelectedSubcategory,
    
    // Mutations
    addCategoryMutation,
    editCategoryMutation,
    deleteCategoryMutation,
    addSubcategoryMutation, 
    editSubcategoryMutation,
    deleteSubcategoryMutation,
    
    // Helpers
    categoryHasSubcategories
  };
};
