
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import CategorySelector from '@/components/CategorySelector';
import { CategoryType, SubcategoryType } from '@/hooks/categories/types';
import { useToast } from '@/hooks/use-toast';

interface FeedbackCategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFeedback: {
    id: string;
    category?: string;
    subcategory?: string;
  } | null;
  onSave: (feedbackId: string, category: string, subcategory: string) => void;
  categories: CategoryType[];
  subcategories: SubcategoryType[];
}

export const FeedbackCategoryDialog: React.FC<FeedbackCategoryDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedFeedback,
  onSave,
  categories,
  subcategories,
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log('FeedbackCategoryDialog render:', { 
    isOpen, 
    selectedFeedback, 
    categoriesCount: categories.length,
    subcategoriesCount: subcategories.length
  });

  const handleSave = async (category: string, subcategory: string) => {
    if (!selectedFeedback?.id) return;

    try {
      setIsSubmitting(true);
      await onSave(selectedFeedback.id, category, subcategory);
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Category Tags</DialogTitle>
          <DialogDescription>
            Select a category and subcategory for this feedback.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {selectedFeedback && (
            <CategorySelector
              initialCategory={selectedFeedback.category}
              initialSubcategory={selectedFeedback.subcategory}
              onSave={handleSave}
              categories={categories}
              subcategories={subcategories}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
