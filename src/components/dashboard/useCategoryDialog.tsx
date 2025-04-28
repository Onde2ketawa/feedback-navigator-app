
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Feedback } from '@/models/feedback';
import { useQueryClient } from '@tanstack/react-query';

export function useCategoryDialog() {
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const handleCategoryChange = async (feedbackId: string, category: string, subcategory: string) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      if (!feedbackId) {
        throw new Error('Feedback ID is required');
      }
      
      console.log('Updating feedback categories using database function:', { feedbackId, category, subcategory });
      
      // Call the database function we created to bypass RLS policies
      const { error } = await supabase
        .rpc('update_feedback_categories', {
          feedback_id: feedbackId,
          category_value: category || null,
          subcategory_value: subcategory || null
        });
      
      if (error) {
        console.error('Supabase RPC error:', error);
        throw new Error(`${error.message || 'Unknown error'}`);
      }
      
      // Invalidate feedback data queries to trigger a refresh
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
      
      toast({
        title: "Categories Updated",
        description: "Feedback categories have been updated successfully.",
      });
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error updating categories:', error);
      
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "There was an error updating the categories.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const openTagDialog = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setIsDialogOpen(true);
  };

  return {
    selectedFeedback,
    isDialogOpen,
    setIsDialogOpen,
    handleCategoryChange,
    openTagDialog,
    isSubmitting
  };
}
