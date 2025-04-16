
import { useState } from 'react';
import { CategoryType, SubcategoryType } from './types';

export const useDialogState = () => {
  // Dialog state
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isAddSubcategoryOpen, setIsAddSubcategoryOpen] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [isEditSubcategoryOpen, setIsEditSubcategoryOpen] = useState(false);
  
  // Subcategory form state
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [editSubcategoryName, setEditSubcategoryName] = useState('');
  
  // Dialog handlers
  const openAddCategoryDialog = () => setIsAddCategoryOpen(true);
  const openEditCategoryDialog = (category: CategoryType | null) => {
    if (category) {
      setIsEditCategoryOpen(true);
    }
  };
  
  const openAddSubcategoryDialog = (category: CategoryType | null) => {
    setNewSubcategoryName('');
    if (category) {
      setIsAddSubcategoryOpen(true);
    }
  };
  
  const openEditSubcategoryDialog = (subcategory: SubcategoryType | null) => {
    if (subcategory) {
      setEditSubcategoryName(subcategory.name);
      setIsEditSubcategoryOpen(true);
    }
  };

  return {
    // Dialog state
    isAddCategoryOpen,
    setIsAddCategoryOpen,
    isAddSubcategoryOpen,
    setIsAddSubcategoryOpen,
    isEditCategoryOpen,
    setIsEditCategoryOpen,
    isEditSubcategoryOpen,
    setIsEditSubcategoryOpen,
    
    // Subcategory form state
    newSubcategoryName,
    setNewSubcategoryName,
    editSubcategoryName,
    setEditSubcategoryName,
    
    // Dialog handlers
    openAddCategoryDialog,
    openEditCategoryDialog,
    openAddSubcategoryDialog,
    openEditSubcategoryDialog
  };
};
