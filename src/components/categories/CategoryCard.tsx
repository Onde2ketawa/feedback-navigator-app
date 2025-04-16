
import React from 'react';
import { 
  Card, 
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CategoryType, SubcategoryType } from '@/hooks/categories/types';
import CategoryCardHeader from './CategoryCardHeader';
import SubcategoriesList from './SubcategoriesList';

interface CategoryCardProps {
  category: CategoryType;
  subcategories: SubcategoryType[];
  onEditCategory: (category: CategoryType) => void;
  onAddSubcategory: (category: CategoryType) => void;
  onDeleteCategory: (categoryId: string) => void;
  onEditSubcategory: (subcategory: SubcategoryType) => void;
  onDeleteSubcategory: (subcategoryId: string) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  subcategories,
  onEditCategory,
  onAddSubcategory,
  onDeleteCategory,
  onEditSubcategory,
  onDeleteSubcategory,
}) => {
  return (
    <Card>
      <CategoryCardHeader
        category={category}
        onEditCategory={onEditCategory}
        onAddSubcategory={onAddSubcategory}
        onDeleteCategory={onDeleteCategory}
      />
      <CardContent>
        <SubcategoriesList
          categoryId={category.id}
          subcategories={subcategories}
          onEditSubcategory={onEditSubcategory}
          onDeleteSubcategory={onDeleteSubcategory}
        />
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onAddSubcategory(category)}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Subcategory
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CategoryCard;
