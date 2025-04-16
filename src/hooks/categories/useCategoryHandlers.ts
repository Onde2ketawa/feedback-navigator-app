
import { useToast } from '@/hooks/use-toast';
import { CategoryType, SubcategoryType } from './types';

export const useCategoryHandlers = (
  addCategoryMutation: any,
  editCategoryMutation: any,
  deleteCategoryMutation: any,
  addSubcategoryMutation: any,
  editSubcategoryMutation: any,
  selectedCategory: CategoryType | null,
  selectedSubcategory: SubcategoryType | null,
  categoryHasSubcategories: (categoryId: string) => boolean,
  newSubcategoryName: string,
  editSubcategoryName: string
) => {
  const { toast } = useToast();
  
  // Category handlers
  const handleAddCategory = (categoryName: string) => {
    if (!categoryName || categoryName.trim() === '') {
      return;
    }
    
    addCategoryMutation.mutate(categoryName.trim());
  };
  
  const handleEditCategory = (categoryName: string) => {
    if (!selectedCategory || !categoryName || categoryName.trim() === '') {
      return;
    }
    
    editCategoryMutation.mutate({ 
      id: selectedCategory.id, 
      name: categoryName.trim() 
    });
  };
  
  const handleDeleteCategory = (categoryId: string) => {
    if (categoryHasSubcategories(categoryId)) {
      toast({
        title: "Cannot delete",
        description: "This category has subcategories. Delete them first.",
        variant: "destructive",
      });
      return;
    }
    
    deleteCategoryMutation.mutate(categoryId);
  };
  
  // Subcategory handlers
  const handleAddSubcategory = () => {
    if (!selectedCategory) return;
    
    if (newSubcategoryName.trim() === '') {
      toast({
        title: "Invalid input",
        description: "Subcategory name cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    addSubcategoryMutation.mutate({
      categoryId: selectedCategory.id,
      name: newSubcategoryName
    });
  };
  
  const handleEditSubcategory = () => {
    if (!selectedSubcategory) return;
    
    if (editSubcategoryName.trim() === '') {
      toast({
        title: "Invalid input",
        description: "Subcategory name cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    editSubcategoryMutation.mutate({
      id: selectedSubcategory.id,
      name: editSubcategoryName
    });
  };
  
  return {
    handleAddCategory,
    handleEditCategory,
    handleDeleteCategory,
    handleAddSubcategory,
    handleEditSubcategory
  };
};
