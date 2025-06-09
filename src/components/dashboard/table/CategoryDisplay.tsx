
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tags } from 'lucide-react';

interface CategoryDisplayProps {
  categoryId: string | undefined;
  subcategoryId: string | undefined;
  categories: { id: string; name: string }[];
  subcategories: { id: string; name: string }[];
  onMultipleCategoryClick?: () => void;
}

export const CategoryDisplay: React.FC<CategoryDisplayProps> = ({
  categoryId,
  subcategoryId,
  categories,
  subcategories,
  onMultipleCategoryClick
}) => {
  if (!categoryId) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground italic">Uncategorized</span>
        {onMultipleCategoryClick && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMultipleCategoryClick}
            className="h-6 w-6 p-0"
            title="Select multiple categories"
          >
            <Tags className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  }
  
  const category = categories.find(c => c.id === categoryId);
  const subcategory = subcategoryId 
    ? subcategories.find(sc => sc.id === subcategoryId)
    : undefined;
    
  return (
    <div className="flex items-center gap-2">
      <div>
        <div className="font-medium text-xs sm:text-sm">{category?.name || 'Unknown'}</div>
        {subcategory && <div className="text-xs text-muted-foreground">{subcategory.name}</div>}
      </div>
      {onMultipleCategoryClick && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onMultipleCategoryClick}
          className="h-6 w-6 p-0"
          title="Select multiple categories"
        >
          <Tags className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};
