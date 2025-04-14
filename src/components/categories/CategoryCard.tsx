
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Pencil, Trash, Tag, Plus } from 'lucide-react';

interface CategoryType {
  id: string;
  name: string;
}

interface SubcategoryType {
  id: string;
  category_id: string;
  name: string;
}

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
  const categorySubcategories = subcategories.filter(sub => sub.category_id === category.id);
  
  return (
    <Card>
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
      <CardContent>
        <CardDescription className="mb-4 flex items-center">
          <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>
            {categorySubcategories.length} subcategories
          </span>
        </CardDescription>
        
        {categorySubcategories.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="subcategories">
              <AccordionTrigger>Subcategories</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {categorySubcategories.map(subcategory => (
                    <div 
                      key={subcategory.id} 
                      className="flex items-center justify-between py-2 px-3 bg-secondary rounded-md"
                    >
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
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ) : (
          <p className="text-muted-foreground text-sm italic">No subcategories yet.</p>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onAddSubcategory(category)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Subcategory
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CategoryCard;
