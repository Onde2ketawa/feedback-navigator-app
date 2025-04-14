
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import CategorySelector from '@/components/CategorySelector';

interface FeedbackCategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFeedback: {
    id: string;
    category?: string;
    subcategory?: string;
  } | null;
  onSave: (feedbackId: string, category: string, subcategory: string) => void;
  categories: { id: string; name: string }[];
  subcategories: { id: string; name: string }[];
}

export const FeedbackCategoryDialog: React.FC<FeedbackCategoryDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedFeedback,
  onSave,
  categories,
  subcategories,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Category Tags</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {selectedFeedback && (
            <CategorySelector
              initialCategory={selectedFeedback.category}
              initialSubcategory={selectedFeedback.subcategory}
              onSave={(category, subcategory) => 
                onSave(selectedFeedback.id, category, subcategory)
              }
              categories={categories}
              subcategories={subcategories}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
