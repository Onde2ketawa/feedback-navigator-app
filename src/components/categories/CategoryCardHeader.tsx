
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, Pencil, Trash, Plus } from 'lucide-react';
import { CategoryType } from '@/hooks/categories/types';

interface CategoryCardHeaderProps {
  category: CategoryType;
  onEditCategory: (category: CategoryType) => void;
  onAddSubcategory: (category: CategoryType) => void;
  onDeleteCategory: (categoryId: string) => void;
}

const CategoryCardHeader: React.FC<CategoryCardHeaderProps> = ({
  category,
  onEditCategory,
  onAddSubcategory,
  onDeleteCategory,
}) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-xl font-bold">{category.name}</CardTitle>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEditCategory(category)}>
            <Pencil className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAddSubcategory(category)}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Add Subcategory</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="text-destructive focus:text-destructive"
            onClick={() => onDeleteCategory(category.id)}
          >
            <Trash className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </CardHeader>
  );
};

export default CategoryCardHeader;
