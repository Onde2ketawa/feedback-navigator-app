
import React from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { useCategories } from '@/hooks/categories'; 
import CategoryCard from '@/components/categories/CategoryCard';
import EmptyState from '@/components/categories/EmptyState';
import CategoryFormsManager from '@/components/categories/CategoryFormsManager';
import { useDialogState } from '@/hooks/categories/useDialogState';
import { useCategoryHandlers } from '@/hooks/categories/useCategoryHandlers';

const Categories: React.FC = () => {
  const { 
    categories,
    subcategories,
    isLoading,
    selectedCategory,
    setSelectedCategory,
    selectedSubcategory,
    setSelectedSubcategory,
    addCategoryMutation,
    editCategoryMutation,
    deleteCategoryMutation,
    addSubcategoryMutation, 
    editSubcategoryMutation,
    deleteSubcategoryMutation,
    categoryHasSubcategories
  } = useCategories();

  // Get dialog state from our hook
  const dialogState = useDialogState();
  
  // Get handlers using our custom hook
  const handlers = useCategoryHandlers(
    addCategoryMutation,
    editCategoryMutation,
    deleteCategoryMutation,
    addSubcategoryMutation,
    editSubcategoryMutation,
    selectedCategory,
    selectedSubcategory,
    categoryHasSubcategories,
    dialogState.newSubcategoryName,
    dialogState.editSubcategoryName
  );
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Category Management" 
        description="Create and manage categories for feedback tagging"
      >
        <Button onClick={dialogState.openAddCategoryDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </PageHeader>
      
      <div className="grid grid-cols-1 gap-6">
        {categories && categories.length > 0 ? (
          categories.map(category => (
            <CategoryCard 
              key={category.id}
              category={category}
              subcategories={subcategories || []}
              onEditCategory={(cat) => {
                setSelectedCategory(cat);
                dialogState.openEditCategoryDialog(cat);
              }}
              onAddSubcategory={(cat) => {
                setSelectedCategory(cat);
                dialogState.openAddSubcategoryDialog(cat);
              }}
              onDeleteCategory={handlers.handleDeleteCategory}
              onEditSubcategory={(sub) => {
                setSelectedSubcategory(sub);
                dialogState.openEditSubcategoryDialog(sub);
              }}
              onDeleteSubcategory={deleteSubcategoryMutation.mutate}
            />
          ))
        ) : (
          <EmptyState onAddCategory={dialogState.openAddCategoryDialog} />
        )}
      </div>
      
      {/* Forms manager component handles all the forms */}
      <CategoryFormsManager 
        {...dialogState}
        handleAddCategory={handlers.handleAddCategory}
        handleEditCategory={handlers.handleEditCategory}
        handleAddSubcategory={handlers.handleAddSubcategory}
        handleEditSubcategory={handlers.handleEditSubcategory}
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
        addCategoryMutation={addCategoryMutation}
        editCategoryMutation={editCategoryMutation}
        addSubcategoryMutation={addSubcategoryMutation}
        editSubcategoryMutation={editSubcategoryMutation}
      />
    </div>
  );
};

export default Categories;
