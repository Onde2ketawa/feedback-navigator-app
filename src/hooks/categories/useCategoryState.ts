
import { useState } from 'react';

interface CategoryType {
  id: string;
  name: string;
}

interface SubcategoryType {
  id: string;
  category_id: string;
  name: string;
}

export const useCategoryState = () => {
  // State for selected items
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<SubcategoryType | null>(null);

  return {
    selectedCategory,
    setSelectedCategory,
    selectedSubcategory,
    setSelectedSubcategory,
  };
};
