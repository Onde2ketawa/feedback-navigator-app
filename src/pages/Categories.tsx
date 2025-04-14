
import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, MoreVertical, Pencil, Trash, Tag, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface CategoryType {
  id: string;
  name: string;
}

interface SubcategoryType {
  id: string;
  category_id: string;
  name: string;
}

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
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<SubcategoryType | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch categories from Supabase
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
        
      if (error) throw error;
      return data as CategoryType[];
    }
  });
  
  // Fetch subcategories from Supabase
  const { data: subcategories, isLoading: subcategoriesLoading } = useQuery({
    queryKey: ['subcategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subcategories')
        .select('*')
        .order('name');
        
      if (error) throw error;
      return data as SubcategoryType[];
    }
  });
  
  // Add category mutation
  const addCategoryMutation = useMutation({
    mutationFn: async (categoryName: string) => {
      const { data, error } = await supabase
        .from('categories')
        .insert([{ name: categoryName }])
        .select();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsAddCategoryOpen(false);
      setNewCategoryName('');
      toast({
        title: "Category added",
        description: `"${newCategoryName}" has been added successfully.`,
      });
    },
    onError: (error) => {
      console.error('Error adding category:', error);
      toast({
        title: "Error",
        description: "Failed to add category. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Edit category mutation
  const editCategoryMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { data, error } = await supabase
        .from('categories')
        .update({ name })
        .eq('id', id)
        .select();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsEditCategoryOpen(false);
      toast({
        title: "Category updated",
        description: `Category has been updated to "${editCategoryName}".`,
      });
    },
    onError: (error) => {
      console.error('Error updating category:', error);
      toast({
        title: "Error",
        description: "Failed to update category. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['subcategories'] });
      
      const categoryToDelete = categories?.find(cat => cat.id === id);
      
      toast({
        title: "Category deleted",
        description: `"${categoryToDelete?.name}" has been deleted.`,
      });
    },
    onError: (error) => {
      console.error('Error deleting category:', error);
      toast({
        title: "Error",
        description: "Failed to delete category. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Add subcategory mutation
  const addSubcategoryMutation = useMutation({
    mutationFn: async ({ categoryId, name }: { categoryId: string; name: string }) => {
      const { data, error } = await supabase
        .from('subcategories')
        .insert([{ 
          category_id: categoryId, 
          name 
        }])
        .select();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subcategories'] });
      setIsAddSubcategoryOpen(false);
      setNewSubcategoryName('');
      
      toast({
        title: "Subcategory added",
        description: `"${newSubcategoryName}" has been added to "${selectedCategory?.name}".`,
      });
    },
    onError: (error) => {
      console.error('Error adding subcategory:', error);
      toast({
        title: "Error",
        description: "Failed to add subcategory. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Edit subcategory mutation
  const editSubcategoryMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { data, error } = await supabase
        .from('subcategories')
        .update({ name })
        .eq('id', id)
        .select();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subcategories'] });
      setIsEditSubcategoryOpen(false);
      
      toast({
        title: "Subcategory updated",
        description: `Subcategory has been updated to "${editSubcategoryName}".`,
      });
    },
    onError: (error) => {
      console.error('Error updating subcategory:', error);
      toast({
        title: "Error",
        description: "Failed to update subcategory. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Delete subcategory mutation
  const deleteSubcategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('subcategories')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['subcategories'] });
      
      const subcategoryToDelete = subcategories?.find(sub => sub.id === id);
      
      toast({
        title: "Subcategory deleted",
        description: `"${subcategoryToDelete?.name}" has been deleted.`,
      });
    },
    onError: (error) => {
      console.error('Error deleting subcategory:', error);
      toast({
        title: "Error",
        description: "Failed to delete subcategory. Please try again.",
        variant: "destructive",
      });
    }
  });
  
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
    
    editCategoryMutation.mutate({ id: selectedCategory.id, name: editCategoryName });
  };
  
  const handleDeleteCategory = (categoryId: string) => {
    // Check if category has subcategories
    const hasSubcategories = subcategories?.some(sub => sub.category_id === categoryId);
    
    if (hasSubcategories) {
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
  
  const handleDeleteSubcategory = (subcategoryId: string) => {
    deleteSubcategoryMutation.mutate(subcategoryId);
  };
  
  const openEditCategoryDialog = (category: CategoryType) => {
    setSelectedCategory(category);
    setEditCategoryName(category.name);
    setIsEditCategoryOpen(true);
  };
  
  const openAddSubcategoryDialog = (category: CategoryType) => {
    setSelectedCategory(category);
    setIsAddSubcategoryOpen(true);
  };
  
  const openEditSubcategoryDialog = (subcategory: SubcategoryType) => {
    setSelectedSubcategory(subcategory);
    setEditSubcategoryName(subcategory.name);
    setIsEditSubcategoryOpen(true);
  };

  // Loading state
  if (categoriesLoading || subcategoriesLoading) {
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
        {categories && categories.map(category => (
          <Card key={category.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">{category.name}</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => openEditCategoryDialog(category)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openAddSubcategoryDialog(category)}>
                    <Plus className="mr-2 h-4 w-4" />
                    <span>Add Subcategory</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4 flex items-center">
                <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>
                  {subcategories ? subcategories.filter(sub => sub.category_id === category.id).length : 0} subcategories
                </span>
              </CardDescription>
              
              {subcategories && subcategories.filter(sub => sub.category_id === category.id).length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="subcategories">
                    <AccordionTrigger>Subcategories</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {subcategories
                          .filter(sub => sub.category_id === category.id)
                          .map(subcategory => (
                            <div 
                              key={subcategory.id} 
                              className="flex items-center justify-between py-2 px-3 bg-secondary rounded-md"
                            >
                              <span>{subcategory.name}</span>
                              <div className="flex space-x-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => openEditSubcategoryDialog(subcategory)}
                                >
                                  <Pencil className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleDeleteSubcategory(subcategory.id)}
                                >
                                  <Trash className="h-4 w-4 text-destructive" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ) : (
                <p className="text-muted-foreground text-sm italic">No subcategories yet.</p>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => openAddSubcategoryDialog(category)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Subcategory
              </Button>
            </CardFooter>
          </Card>
        ))}

        {categories && categories.length === 0 && (
          <Card className="bg-muted/50">
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Tag className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No categories yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Create categories to organize and classify your feedback.
              </p>
              <Button onClick={() => setIsAddCategoryOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Category
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Add Category Dialog */}
      <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>
              Create a new category for grouping feedback.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">Category Name</label>
            <Input 
              placeholder="Enter category name" 
              value={newCategoryName} 
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleAddCategory} 
              disabled={addCategoryMutation.isPending}
            >
              {addCategoryMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Category Dialog */}
      <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update the category name.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">Category Name</label>
            <Input 
              placeholder="Enter category name" 
              value={editCategoryName} 
              onChange={(e) => setEditCategoryName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCategoryOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleEditCategory}
              disabled={editCategoryMutation.isPending}
            >
              {editCategoryMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Subcategory Dialog */}
      <Dialog open={isAddSubcategoryOpen} onOpenChange={setIsAddSubcategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Subcategory</DialogTitle>
            <DialogDescription>
              {selectedCategory && `Add a subcategory to "${selectedCategory.name}".`}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">Subcategory Name</label>
            <Input 
              placeholder="Enter subcategory name" 
              value={newSubcategoryName} 
              onChange={(e) => setNewSubcategoryName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddSubcategoryOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleAddSubcategory}
              disabled={addSubcategoryMutation.isPending}
            >
              {addSubcategoryMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Subcategory
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Subcategory Dialog */}
      <Dialog open={isEditSubcategoryOpen} onOpenChange={setIsEditSubcategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subcategory</DialogTitle>
            <DialogDescription>
              Update the subcategory name.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">Subcategory Name</label>
            <Input 
              placeholder="Enter subcategory name" 
              value={editSubcategoryName} 
              onChange={(e) => setEditSubcategoryName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditSubcategoryOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleEditSubcategory}
              disabled={editSubcategoryMutation.isPending}
            >
              {editSubcategoryMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categories;
