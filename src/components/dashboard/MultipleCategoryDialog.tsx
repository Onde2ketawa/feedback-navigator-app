
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Feedback } from '@/models/feedback';
import { useToast } from '@/hooks/use-toast';

interface MultipleCategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFeedback: Feedback | null;
  categories: { id: string; name: string }[];
  subcategories: { id: string; name: string }[];
  onSave: (feedbackId: string, selectedCategories: string[]) => void;
  isSubmitting?: boolean;
}

export const MultipleCategoryDialog: React.FC<MultipleCategoryDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedFeedback,
  categories,
  subcategories,
  onSave,
  isSubmitting = false,
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { toast } = useToast();

  React.useEffect(() => {
    if (selectedFeedback?.category) {
      setSelectedCategories([selectedFeedback.category]);
    } else {
      setSelectedCategories([]);
    }
  }, [selectedFeedback]);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSave = () => {
    if (!selectedFeedback || selectedCategories.length === 0) {
      toast({
        title: "Selection Required",
        description: "Please select at least one category.",
        variant: "destructive",
      });
      return;
    }

    onSave(selectedFeedback.id, selectedCategories);
  };

  return (
    <Dialog open={isOpen} onOpenChange={isSubmitting ? undefined : onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[600px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Multiple Categories</DialogTitle>
          <DialogDescription>
            Choose all relevant categories for this feedback. You can select multiple categories.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="text-sm font-medium">Available Categories:</div>
          <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-3 p-2 border rounded">
                <Checkbox
                  id={category.id}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={() => handleCategoryToggle(category.id)}
                />
                <label
                  htmlFor={category.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                >
                  {category.name}
                </label>
              </div>
            ))}
          </div>
          
          {selectedCategories.length > 0 && (
            <div className="mt-4">
              <div className="text-sm font-medium mb-2">Selected: {selectedCategories.length} categories</div>
              <div className="flex flex-wrap gap-2">
                {selectedCategories.map(categoryId => {
                  const category = categories.find(c => c.id === categoryId);
                  return (
                    <span key={categoryId} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                      {category?.name}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSubmitting || selectedCategories.length === 0}
          >
            {isSubmitting ? 'Saving...' : 'Save Categories'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
