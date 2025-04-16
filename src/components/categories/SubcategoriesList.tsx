
import React from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { CardDescription } from '@/components/ui/card';
import { Tag } from 'lucide-react';
import { SubcategoryType } from '@/hooks/categories/types';
import SubcategoryItem from './SubcategoryItem';

interface SubcategoriesListProps {
  categoryId: string;
  subcategories: SubcategoryType[];
  onEditSubcategory: (subcategory: SubcategoryType) => void;
  onDeleteSubcategory: (subcategoryId: string) => void;
}

const SubcategoriesList: React.FC<SubcategoriesListProps> = ({
  categoryId,
  subcategories,
  onEditSubcategory,
  onDeleteSubcategory,
}) => {
  // Make sure we're properly filtering subcategories by category_id
  const categorySubcategories = subcategories.filter(sub => sub.category_id === categoryId);

  return (
    <>
      <CardDescription className="mb-4 flex items-center">
        <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
        <span>
          {categorySubcategories.length} subcategories
        </span>
      </CardDescription>
      
      {categorySubcategories.length > 0 ? (
        <Accordion type="single" collapsible className="w-full" defaultValue="subcategories">
          <AccordionItem value="subcategories">
            <AccordionTrigger>Subcategories</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {categorySubcategories.map(subcategory => (
                  <SubcategoryItem
                    key={subcategory.id}
                    subcategory={subcategory}
                    onEditSubcategory={onEditSubcategory}
                    onDeleteSubcategory={onDeleteSubcategory}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : (
        <p className="text-muted-foreground text-sm italic">No subcategories yet.</p>
      )}
    </>
  );
};

export default SubcategoriesList;
