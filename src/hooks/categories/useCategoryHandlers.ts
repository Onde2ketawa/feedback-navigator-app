
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
      toast({
        title: "Invalid input",
        description: "Category name cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    addCategoryMutation.mutate(categoryName.trim());
  };
  
  const handleEditCategory = (categoryName: string) => {
    if (!selectedCategory || !categoryName || categoryName.trim() === '') {
      if (!selectedCategory) {
        toast({
          title: "Operation failed",
          description: "No category selected for editing",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Invalid input",
          description: "Category name cannot be empty",
          variant: "destructive",
        });
      }
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
  
  // Subcategory handlers with improved validation
  const handleAddSubcategory = () => {
    if (!selectedCategory) {
      toast({
        title: "Operation failed",
        description: "No category selected for adding subcategory",
        variant: "destructive",
      });
      return;
    }
    
    // Validate subcategory name
    if (!newSubcategoryName || newSubcategoryName.trim() === '') {
      toast({
        title: "Invalid input",
        description: "Subcategory name cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    // Proceed with mutation
    addSubcategoryMutation.mutate({
      categoryId: selectedCategory.id,
      name: newSubcategoryName.trim()
    });
  };
  
  const handleEditSubcategory = () => {
    if (!selectedSubcategory) {
      toast({
        title: "Operation failed",
        description: "No subcategory selected for editing",
        variant: "destructive",
      });
      return;
    }
    
    // Validate subcategory name
    if (!editSubcategoryName || editSubcategoryName.trim() === '') {
      toast({
        title: "Invalid input",
        description: "Subcategory name cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    // Proceed with mutation
    editSubcategoryMutation.mutate({
      id: selectedSubcategory.id,
      name: editSubcategoryName.trim()
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
