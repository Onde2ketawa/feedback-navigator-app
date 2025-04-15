
import { useCategoryState } from './useCategoryState';
import { useCategoryQueries } from './useCategoryQueries';
import { useCategoryMutations } from './useCategoryMutations';
import { useSubcategoryMutations } from './useSubcategoryMutations';
import { CategoryType, SubcategoryType } from './types';

export const useCategories = () => {
  // Combine all individual hooks
  const state = useCategoryState();
  const queries = useCategoryQueries();
  const categoryMutations = useCategoryMutations();
  const subcategoryMutations = useSubcategoryMutations();
  
  return {
    // Data and loading state
    categories: queries.categories,
    subcategories: queries.subcategories,
    isLoading: queries.isLoading,
    
    // Selected states
    selectedCategory: state.selectedCategory,
    setSelectedCategory: state.setSelectedCategory,
    selectedSubcategory: state.selectedSubcategory,
    setSelectedSubcategory: state.setSelectedSubcategory,
    
    // Category mutations
    addCategoryMutation: categoryMutations.addCategoryMutation,
    editCategoryMutation: categoryMutations.editCategoryMutation,
    deleteCategoryMutation: categoryMutations.deleteCategoryMutation,
    
    // Subcategory mutations
    addSubcategoryMutation: subcategoryMutations.addSubcategoryMutation, 
    editSubcategoryMutation: subcategoryMutations.editSubcategoryMutation,
    deleteSubcategoryMutation: subcategoryMutations.deleteSubcategoryMutation,
    
    // Helpers
    categoryHasSubcategories: queries.categoryHasSubcategories
  };
};

export type { CategoryType, SubcategoryType };
