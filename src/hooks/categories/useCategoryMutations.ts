
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useCategoryMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAdmin } = useAuth();
  
  // Add category mutation using RPC instead of direct insert
  const addCategoryMutation = useMutation({
    mutationFn: async (categoryName: string) => {
      if (!isAdmin) {
        throw new Error("You don't have permission to add categories.");
      }
      
      // Call the database function to add a category
      const { data, error } = await supabase
        .rpc('add_category', { name_value: categoryName })
        .single();
        
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
  
  // Edit category mutation using RPC
  const editCategoryMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      if (!isAdmin) {
        throw new Error("You don't have permission to edit categories.");
      }
      
      const { data, error } = await supabase
        .rpc('edit_category', { category_id: id, name_value: name });
        
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
  
  // Delete category mutation using RPC
  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!isAdmin) {
        throw new Error("You don't have permission to delete categories.");
      }
      
      const { error } = await supabase
        .rpc('delete_category', { category_id: id });
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['subcategories'] });
      
      toast({
        title: "Category deleted",
        description: "Category has been deleted successfully.",
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

  return {
    addCategoryMutation,
    editCategoryMutation,
    deleteCategoryMutation
  };
};
