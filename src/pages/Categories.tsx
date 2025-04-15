
import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCategories } from '@/hooks/categories'; // Updated import
import CategoryForm from '@/components/categories/CategoryForm';
import CategoryCard from '@/components/categories/CategoryCard';
import EmptyState from '@/components/categories/EmptyState';

const Categories: React.FC = () => {
  // State for dialogs
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isAddSubcategoryOpen, setIsAddSubcategoryOpen] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [isEditSubcategoryOpen, setIsEditSubcategoryOpen] = useState(false);
  
  // Form state
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editCategoryName, setEditCategoryName] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [editSubcategoryName, setEditSubcategoryName] = useState('');
  
  const { toast } = useToast();
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

  // Handlers
  const handleAddCategory = () => {
    if (newCategoryName.trim() === '') {
      toast({
        title: "Invalid input",
        description: "Category name cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    addCategoryMutation.mutate(newCategoryName);
    setIsAddCategoryOpen(false);
    setNewCategoryName('');
  };
  
  const handleEditCategory = () => {
    if (!selectedCategory) return;
    
    if (editCategoryName.trim() === '') {
      toast({
        title: "Invalid input",
        description: "Category name cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    editCategoryMutation.mutate({ 
      id: selectedCategory.id, 
      name: editCategoryName 
    });
    setIsEditCategoryOpen(false);
  };
  
  const handleDeleteCategory = (categoryId: string) => {
    // Check if category has subcategories
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
    setIsAddSubcategoryOpen(false);
    setNewSubcategoryName('');
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
    setIsEditSubcategoryOpen(false);
  };
  
  const openEditCategoryDialog = (category: typeof selectedCategory) => {
    setSelectedCategory(category);
    if (category) {
      setEditCategoryName(category.name);
      setIsEditCategoryOpen(true);
    }
  };
  
  const openAddSubcategoryDialog = (category: typeof selectedCategory) => {
    setSelectedCategory(category);
    setIsAddSubcategoryOpen(true);
  };
  
  const openEditSubcategoryDialog = (subcategory: typeof selectedSubcategory) => {
    setSelectedSubcategory(subcategory);
    if (subcategory) {
      setEditSubcategoryName(subcategory.name);
      setIsEditSubcategoryOpen(true);
    }
  };

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
        <Button onClick={() => setIsAddCategoryOpen(true)}>
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
              onEditCategory={openEditCategoryDialog}
              onAddSubcategory={openAddSubcategoryDialog}
              onDeleteCategory={handleDeleteCategory}
              onEditSubcategory={openEditSubcategoryDialog}
              onDeleteSubcategory={deleteSubcategoryMutation.mutate}
            />
          ))
        ) : (
          <EmptyState onAddCategory={() => setIsAddCategoryOpen(true)} />
        )}
      </div>
      
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
        initialValue={editCategoryName}
        submitLabel="Save Changes"
        isSubmitting={editCategoryMutation.isPending}
      />
      
      {/* Add Subcategory Form */}
      <CategoryForm
        isOpen={isAddSubcategoryOpen}
        onClose={() => setIsAddSubcategoryOpen(false)}
        onSubmit={handleAddSubcategory}
        title="Add Subcategory"
        description={selectedCategory ? `Add a subcategory to "${selectedCategory.name}".` : "Add a subcategory"}
        submitLabel="Add Subcategory"
        isSubmitting={addSubcategoryMutation.isPending}
      />
      
      {/* Edit Subcategory Form */}
      <CategoryForm
        isOpen={isEditSubcategoryOpen}
        onClose={() => setIsEditSubcategoryOpen(false)}
        onSubmit={handleEditSubcategory}
        title="Edit Subcategory"
        description="Update the subcategory name."
        initialValue={editSubcategoryName}
        submitLabel="Save Changes"
        isSubmitting={editSubcategoryMutation.isPending}
      />
    </div>
  );
};

export default Categories;
