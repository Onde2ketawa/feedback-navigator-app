
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
  
  // Subcategory handlers with improved validation and debug logging
  const handleAddSubcategory = (subcategoryName: string) => {
    console.log("handleAddSubcategory called with:", { 
      selectedCategory, 
      subcategoryName 
    });
    
    if (!selectedCategory) {
      toast({
        title: "Operation failed",
        description: "No category selected for adding subcategory",
        variant: "destructive",
      });
      return;
    }
    
    // Validate subcategory name with more detailed feedback
    if (!subcategoryName) {
      toast({
        title: "Invalid input",
        description: "Subcategory name is missing",
        variant: "destructive",
      });
      return;
    }
    
    const trimmedName = subcategoryName.trim();
    if (trimmedName === '') {
      toast({
        title: "Invalid input",
        description: "Subcategory name cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    // Proceed with mutation
    console.log("Adding subcategory:", {
      categoryId: selectedCategory.id,
      name: trimmedName
    });
    
    addSubcategoryMutation.mutate({
      categoryId: selectedCategory.id,
      name: trimmedName
    });
  };
  
  const handleEditSubcategory = (subcategoryName: string) => {
    console.log("handleEditSubcategory called with:", { 
      selectedSubcategory, 
      subcategoryName 
    });
    
    if (!selectedSubcategory) {
      toast({
        title: "Operation failed",
        description: "No subcategory selected for editing",
        variant: "destructive",
      });
      return;
    }
    
    // Validate subcategory name with more detailed feedback
    if (!subcategoryName) {
      toast({
        title: "Invalid input",
        description: "Subcategory name is missing",
        variant: "destructive",
      });
      return;
    }
    
    const trimmedName = subcategoryName.trim();
    if (trimmedName === '') {
      toast({
        title: "Invalid input",
        description: "Subcategory name cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    // Proceed with mutation
    console.log("Editing subcategory:", {
      id: selectedSubcategory.id,
      name: trimmedName
    });
    
    editSubcategoryMutation.mutate({
      id: selectedSubcategory.id,
      name: trimmedName
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
