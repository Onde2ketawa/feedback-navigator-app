
import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface CategorySelectorProps {
  initialCategory?: string;
  initialSubcategory?: string;
  onSave: (category: string, subcategory: string) => void;
  categories: { id: string; name: string }[];
  subcategories: { id: string; category_id: string; name: string }[];
  isSubmitting?: boolean;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  initialCategory = '',
  initialSubcategory = '',
  onSave,
  categories,
  subcategories,
  isSubmitting = false,
}) => {
  const [category, setCategory] = useState(initialCategory);
  const [subcategory, setSubcategory] = useState(initialSubcategory);
  const [availableSubcategories, setAvailableSubcategories] = useState<{ id: string; name: string }[]>([]);

  // Reset states when initial values change (dialog reopens)
  useEffect(() => {
    setCategory(initialCategory);
    setSubcategory(initialSubcategory);
  }, [initialCategory, initialSubcategory]);

  // Filter subcategories when category changes
  useEffect(() => {
    if (category) {
      // Filter subcategories based on the selected category_id
      const filtered = subcategories.filter(subcat => subcat.category_id === category);
      setAvailableSubcategories(filtered);
      
      // Reset subcategory if the current one doesn't belong to the new category
      if (subcategory && !filtered.find(sc => sc.id === subcategory)) {
        setSubcategory('');
      }
    } else {
      setAvailableSubcategories([]);
      setSubcategory('');
    }
  }, [category, subcategories, subcategory]);

  const handleSave = () => {
    console.log('Saving category:', category, 'subcategory:', subcategory);
    onSave(category || '', subcategory || '');
  };

  return (
    <div className="space-y-4">
      <Select value={category} onValueChange={setCategory} disabled={isSubmitting}>
        <SelectTrigger>
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={subcategory}
        onValueChange={setSubcategory}
        disabled={!category || availableSubcategories.length === 0 || isSubmitting}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select subcategory" />
        </SelectTrigger>
        <SelectContent>
          {availableSubcategories.map((subcat) => (
            <SelectItem key={subcat.id} value={subcat.id}>
              {subcat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button 
        onClick={handleSave}
        disabled={!category || isSubmitting}
        className="w-full"
      >
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Tags
      </Button>
    </div>
  );
};

export default CategorySelector;
