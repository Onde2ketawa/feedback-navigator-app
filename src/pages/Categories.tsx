
import React, { useState } from 'react';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, MoreVertical, Pencil, Trash, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CategoryType {
  id: string;
  name: string;
}

interface SubcategoryType {
  id: string;
  categoryId: string;
  name: string;
}

const Categories: React.FC = () => {
  // Mock data
  const [categories, setCategories] = useState<CategoryType[]>([
    { id: 'cat1', name: 'Technical Issues' },
    { id: 'cat2', name: 'Customer Service' },
    { id: 'cat3', name: 'Product Features' },
    { id: 'cat4', name: 'Usability' },
  ]);
  
  const [subcategories, setSubcategories] = useState<SubcategoryType[]>([
    { id: 'sub1', categoryId: 'cat1', name: 'Login Problems' },
    { id: 'sub2', categoryId: 'cat1', name: 'App Crashes' },
    { id: 'sub3', categoryId: 'cat1', name: 'Slow Performance' },
    { id: 'sub4', categoryId: 'cat2', name: 'Response Time' },
    { id: 'sub5', categoryId: 'cat2', name: 'Staff Knowledge' },
    { id: 'sub6', categoryId: 'cat3', name: 'Missing Features' },
    { id: 'sub7', categoryId: 'cat3', name: 'Feature Requests' },
    { id: 'sub8', categoryId: 'cat4', name: 'UI Design' },
    { id: 'sub9', categoryId: 'cat4', name: 'Navigation' },
  ]);
  
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
    
    const newId = `cat${categories.length + 1}`;
    setCategories([...categories, { id: newId, name: newCategoryName }]);
    setNewCategoryName('');
    setIsAddCategoryOpen(false);
    
    toast({
      title: "Category added",
      description: `"${newCategoryName}" has been added successfully.`,
    });
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
    
    setCategories(categories.map(cat => 
      cat.id === selectedCategory.id ? { ...cat, name: editCategoryName } : cat
    ));
    
    setIsEditCategoryOpen(false);
    
    toast({
      title: "Category updated",
      description: `Category has been updated to "${editCategoryName}".`,
    });
  };
  
  const handleDeleteCategory = (categoryId: string) => {
    // Check if category has subcategories
    const hasSubcategories = subcategories.some(sub => sub.categoryId === categoryId);
    
    if (hasSubcategories) {
      toast({
        title: "Cannot delete",
        description: "This category has subcategories. Delete them first.",
        variant: "destructive",
      });
      return;
    }
    
    const categoryToDelete = categories.find(cat => cat.id === categoryId);
    setCategories(categories.filter(cat => cat.id !== categoryId));
    
    toast({
      title: "Category deleted",
      description: `"${categoryToDelete?.name}" has been deleted.`,
    });
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
    
    const newId = `sub${subcategories.length + 1}`;
    setSubcategories([
      ...subcategories, 
      { 
        id: newId, 
        categoryId: selectedCategory.id, 
        name: newSubcategoryName 
      }
    ]);
    
    setNewSubcategoryName('');
    setIsAddSubcategoryOpen(false);
    
    toast({
      title: "Subcategory added",
      description: `"${newSubcategoryName}" has been added to "${selectedCategory.name}".`,
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
    
    setSubcategories(subcategories.map(sub => 
      sub.id === selectedSubcategory.id ? { ...sub, name: editSubcategoryName } : sub
    ));
    
    setIsEditSubcategoryOpen(false);
    
    toast({
      title: "Subcategory updated",
      description: `Subcategory has been updated to "${editSubcategoryName}".`,
    });
  };
  
  const handleDeleteSubcategory = (subcategoryId: string) => {
    const subcategoryToDelete = subcategories.find(sub => sub.id === subcategoryId);
    setSubcategories(subcategories.filter(sub => sub.id !== subcategoryId));
    
    toast({
      title: "Subcategory deleted",
      description: `"${subcategoryToDelete?.name}" has been deleted.`,
    });
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
        {categories.map(category => (
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
                  {subcategories.filter(sub => sub.categoryId === category.id).length} subcategories
                </span>
              </CardDescription>
              
              {subcategories.filter(sub => sub.categoryId === category.id).length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="subcategories">
                    <AccordionTrigger>Subcategories</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {subcategories
                          .filter(sub => sub.categoryId === category.id)
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
            <Button onClick={handleAddCategory}>Add Category</Button>
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
            <Button onClick={handleEditCategory}>Save Changes</Button>
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
            <Button onClick={handleAddSubcategory}>Add Subcategory</Button>
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
            <Button onClick={handleEditSubcategory}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categories;
