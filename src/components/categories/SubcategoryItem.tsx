
import React from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Trash } from 'lucide-react';
import { SubcategoryType } from '@/hooks/categories/types';

interface SubcategoryItemProps {
  subcategory: SubcategoryType;
  onEditSubcategory: (subcategory: SubcategoryType) => void;
  onDeleteSubcategory: (subcategoryId: string) => void;
}

const SubcategoryItem: React.FC<SubcategoryItemProps> = ({
  subcategory,
  onEditSubcategory,
  onDeleteSubcategory,
}) => {
  return (
    <div className="flex items-center justify-between py-2 px-3 bg-secondary rounded-md">
      <span>{subcategory.name}</span>
      <div className="flex space-x-1">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onEditSubcategory(subcategory)}
        >
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onDeleteSubcategory(subcategory.id)}
        >
          <Trash className="h-4 w-4 text-destructive" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>
    </div>
  );
};

export default SubcategoryItem;
