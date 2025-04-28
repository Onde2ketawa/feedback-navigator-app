
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useSubcategoryMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAdmin } = useAuth();
  
  // Add subcategory mutation using RPC function
  const addSubcategoryMutation = useMutation({
    mutationFn: async ({ categoryId, name }: { categoryId: string; name: string }) => {
      if (!isAdmin) {
        throw new Error("You don't have permission to add subcategories.");
      }
      
      const { data, error } = await supabase
        .rpc('add_subcategory', {
          category_id_value: categoryId,
          name_value: name
        });
        
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
  
  // Edit subcategory mutation using RPC function
  const editSubcategoryMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      if (!isAdmin) {
        throw new Error("You don't have permission to edit subcategories.");
      }
      
      const { error } = await supabase
        .rpc('edit_subcategory', {
          subcategory_id: id,
          name_value: name
        });
        
      if (error) throw error;
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
  
  // Delete subcategory mutation using RPC function
  const deleteSubcategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!isAdmin) {
        throw new Error("You don't have permission to delete subcategories.");
      }
      
      const { error } = await supabase
        .rpc('delete_subcategory', {
          subcategory_id: id
        });
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subcategories'] });
      
      toast({
        title: "Subcategory deleted",
        description: "Subcategory has been deleted successfully.",
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

  return {
    addSubcategoryMutation, 
    editSubcategoryMutation,
    deleteSubcategoryMutation
  };
};
