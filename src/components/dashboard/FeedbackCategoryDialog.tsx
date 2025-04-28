
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import CategorySelector from '@/components/CategorySelector';
import { CategoryType, SubcategoryType } from '@/hooks/categories/types';

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
  isSubmitting?: boolean;
}

export const FeedbackCategoryDialog: React.FC<FeedbackCategoryDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedFeedback,
  onSave,
  categories,
  subcategories,
  isSubmitting = false,
}) => {
  console.log('FeedbackCategoryDialog render:', { 
    isOpen, 
    selectedFeedback, 
    categoriesCount: categories.length,
    subcategoriesCount: subcategories.length
  });
  
  return (
    <Dialog open={isOpen} onOpenChange={isSubmitting ? undefined : onOpenChange}>
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
              onSave={(category, subcategory) => onSave(selectedFeedback.id, category, subcategory)}
              categories={categories}
              subcategories={subcategories}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
