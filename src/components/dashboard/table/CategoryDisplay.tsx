
import React from 'react';

interface CategoryDisplayProps {
  categoryId: string | undefined;
  subcategoryId: string | undefined;
  categories: { id: string; name: string }[];
  subcategories: { id: string; name: string }[];
}

export const CategoryDisplay: React.FC<CategoryDisplayProps> = ({
  categoryId,
  subcategoryId,
  categories,
  subcategories
}) => {
  if (!categoryId) {
    return <span className="text-muted-foreground italic">Uncategorized</span>;
  }
  
  const category = categories.find(c => c.id === categoryId);
  const subcategory = subcategoryId 
    ? subcategories.find(sc => sc.id === subcategoryId)
    : undefined;
    
  return (
    <div>
      <div className="font-medium text-xs sm:text-sm">{category?.name || 'Unknown'}</div>
      {subcategory && <div className="text-xs text-muted-foreground">{subcategory.name}</div>}
    </div>
  );
};
