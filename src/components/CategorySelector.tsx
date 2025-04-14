
import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface CategorySelectorProps {
  initialCategory?: string;
  initialSubcategory?: string;
  onSave: (category: string, subcategory: string) => void;
  categories: { id: string; name: string }[];
  subcategories: { id: string; name: string }[];
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  initialCategory = '',
  initialSubcategory = '',
  onSave,
  categories,
  subcategories,
}) => {
  const [category, setCategory] = useState(initialCategory);
  const [subcategory, setSubcategory] = useState(initialSubcategory);
  const [availableSubcategories, setAvailableSubcategories] = useState<{ id: string; name: string }[]>([]);

  // Filter subcategories when category changes
  useEffect(() => {
    if (category) {
      // In a real implementation, you would fetch subcategories based on the selected category
      // Here we're just filtering the mock data
      const filtered = subcategories.filter(subcat => subcat.id.startsWith(category));
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

  return (
    <div className="space-y-4">
      <Select value={category} onValueChange={setCategory}>
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
        disabled={!category || availableSubcategories.length === 0}
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
        onClick={() => onSave(category, subcategory)}
        disabled={!category}
      >
        Save Tags
      </Button>
    </div>
  );
};

export default CategorySelector;
