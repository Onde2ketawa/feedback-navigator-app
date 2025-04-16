
import React from 'react';
import CategoryForm from './CategoryForm';
import { CategoryType, SubcategoryType } from '@/hooks/categories/types';

interface CategoryFormsManagerProps {
  isAddCategoryOpen: boolean;
  setIsAddCategoryOpen: (isOpen: boolean) => void;
  isEditCategoryOpen: boolean;
  setIsEditCategoryOpen: (isOpen: boolean) => void;
  isAddSubcategoryOpen: boolean;
  setIsAddSubcategoryOpen: (isOpen: boolean) => void;
  isEditSubcategoryOpen: boolean;
  setIsEditSubcategoryOpen: (isOpen: boolean) => void;
  handleAddCategory: (categoryName: string) => void;
  handleEditCategory: (categoryName: string) => void;
  handleAddSubcategory: () => void;
  handleEditSubcategory: () => void;
  newSubcategoryName: string;
  setNewSubcategoryName: (name: string) => void;
  editSubcategoryName: string;
  setEditSubcategoryName: (name: string) => void;
  selectedCategory: CategoryType | null;
  selectedSubcategory: SubcategoryType | null;
  addCategoryMutation: { isPending: boolean };
  editCategoryMutation: { isPending: boolean };
  addSubcategoryMutation: { isPending: boolean };
  editSubcategoryMutation: { isPending: boolean };
}

const CategoryFormsManager: React.FC<CategoryFormsManagerProps> = ({
  isAddCategoryOpen,
  setIsAddCategoryOpen,
  isEditCategoryOpen,
  setIsEditCategoryOpen,
  isAddSubcategoryOpen,
  setIsAddSubcategoryOpen,
  isEditSubcategoryOpen,
  setIsEditSubcategoryOpen,
  handleAddCategory,
  handleEditCategory,
  handleAddSubcategory,
  handleEditSubcategory,
  newSubcategoryName,
  setNewSubcategoryName,
  editSubcategoryName,
  setEditSubcategoryName,
  selectedCategory,
  selectedSubcategory,
  addCategoryMutation,
  editCategoryMutation,
  addSubcategoryMutation,
  editSubcategoryMutation
}) => {
  // Direct handlers that bypass state management in this component
  // and rely on the parent component's validation
  const handleAddCategorySubmit = (name: string) => {
    if (!name || name.trim() === '') return;
    handleAddCategory(name);
  };
  
  const handleEditCategorySubmit = (name: string) => {
    if (!name || name.trim() === '') return;
    handleEditCategory(name);
  };
  
  // Subcategory handlers that update state first
  const handleAddSubcategorySubmit = (name: string) => {
    if (!name || name.trim() === '') return;
    setNewSubcategoryName(name.trim());
    // Use Promise.resolve() to ensure state is updated before handler is called
    Promise.resolve().then(() => {
      handleAddSubcategory();
    });
  };
  
  const handleEditSubcategorySubmit = (name: string) => {
    if (!name || name.trim() === '') return;
    setEditSubcategoryName(name.trim());
    // Use Promise.resolve() to ensure state is updated before handler is called
    Promise.resolve().then(() => {
      handleEditSubcategory();
    });
  };
  
  return (
    <>
      {/* Add Category Form */}
      <CategoryForm
        isOpen={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
        onSubmit={handleAddCategorySubmit}
        title="Add Category"
        description="Create a new category for grouping feedback."
        submitLabel="Add Category"
        isSubmitting={addCategoryMutation.isPending}
      />
      
      {/* Edit Category Form */}
      <CategoryForm
        isOpen={isEditCategoryOpen}
        onClose={() => setIsEditCategoryOpen(false)}
        onSubmit={handleEditCategorySubmit}
        title="Edit Category"
        description="Update the category name."
        initialValue={selectedCategory?.name || ''}
        submitLabel="Save Changes"
        isSubmitting={editCategoryMutation.isPending}
      />
      
      {/* Add Subcategory Form */}
      <CategoryForm
        isOpen={isAddSubcategoryOpen}
        onClose={() => setIsAddSubcategoryOpen(false)}
        onSubmit={handleAddSubcategorySubmit}
        title="Add Subcategory"
        description={selectedCategory ? `Add a subcategory to "${selectedCategory.name}".` : "Add a subcategory"}
        submitLabel="Add Subcategory"
        isSubmitting={addSubcategoryMutation.isPending}
      />
      
      {/* Edit Subcategory Form */}
      <CategoryForm
        isOpen={isEditSubcategoryOpen}
        onClose={() => setIsEditSubcategoryOpen(false)}
        onSubmit={handleEditSubcategorySubmit}
        title="Edit Subcategory"
        description="Update the subcategory name."
        initialValue={selectedSubcategory?.name || ''}
        submitLabel="Save Changes"
        isSubmitting={editSubcategoryMutation.isPending}
      />
    </>
  );
};

export default CategoryFormsManager;
