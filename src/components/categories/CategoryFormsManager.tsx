
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
  return (
    <>
      {/* Add Category Form */}
      <CategoryForm
        isOpen={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
        onSubmit={handleAddCategory}
        title="Add Category"
        description="Create a new category for grouping feedback."
        submitLabel="Add Category"
        isSubmitting={addCategoryMutation.isPending}
      />
      
      {/* Edit Category Form */}
      <CategoryForm
        isOpen={isEditCategoryOpen}
        onClose={() => setIsEditCategoryOpen(false)}
        onSubmit={handleEditCategory}
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
        onSubmit={(name) => {
          setNewSubcategoryName(name);
          // Only call handleAddSubcategory after setting the name
          setTimeout(() => handleAddSubcategory(), 0);
        }}
        title="Add Subcategory"
        description={selectedCategory ? `Add a subcategory to "${selectedCategory.name}".` : "Add a subcategory"}
        submitLabel="Add Subcategory"
        isSubmitting={addSubcategoryMutation.isPending}
      />
      
      {/* Edit Subcategory Form */}
      <CategoryForm
        isOpen={isEditSubcategoryOpen}
        onClose={() => setIsEditSubcategoryOpen(false)}
        onSubmit={(name) => {
          setEditSubcategoryName(name);
          // Only call handleEditSubcategory after setting the name
          setTimeout(() => handleEditSubcategory(), 0);
        }}
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
