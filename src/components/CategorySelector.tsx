
import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface CategorySelectorProps {
  initialCategory?: string;
  initialSubcategory?: string;
  onSave: (category: string, subcategory: string) => void;
  categories: { id: string; name: string }[];
  subcategories: { id: string; category_id: string; name: string }[];
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
  const { toast } = useToast();

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
    try {
      onSave(category || '', subcategory || '');
      toast({
        title: "Tag selection saved",
        description: "Your category selection has been saved.",
      });
    } catch (error) {
      console.error('Error saving tags:', error);
      toast({
        title: "Error saving tags",
        description: "There was a problem saving your category selection.",
        variant: "destructive",
      });
    }
  };

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
        onClick={handleSave}
        disabled={!category}
      >
        Save Tags
      </Button>
    </div>
  );
};

export default CategorySelector;
