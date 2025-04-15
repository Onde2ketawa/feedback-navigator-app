
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Feedback } from '@/models/feedback';

export function useCategoryDialog() {
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const handleCategoryChange = async (feedbackId: string, category: string, subcategory: string) => {
    try {
      const { error } = await supabase
        .from('customer_feedback')
        .update({ 
          category: category || null, 
          sub_category: subcategory || null
        })
        .eq('id', feedbackId);
      
      if (error) throw error;
      
      toast({
        title: "Categories Updated",
        description: "Feedback categories have been updated successfully.",
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error updating categories:', error);
      toast({
        title: "Update Failed",
        description: "There was an error updating the categories.",
        variant: "destructive",
      });
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
    openTagDialog
  };
}
