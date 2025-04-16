
import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  title: string;
  description: string;
  initialValue?: string;
  submitLabel: string;
  isSubmitting: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  description,
  initialValue = '',
  submitLabel,
  isSubmitting,
}) => {
  const [name, setName] = useState(initialValue);
  const [error, setError] = useState('');

  // Reset form state when dialog opens/closes or initialValue changes
  useEffect(() => {
    setName(initialValue);
    setError('');
  }, [isOpen, initialValue]);

  const handleSubmit = () => {
    // Validate input
    if (!name.trim()) {
      setError('Category name cannot be empty');
      return;
    }
    
    setError('');
    onSubmit(name);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <label className="text-sm font-medium mb-2 block">Name</label>
          <Input 
            placeholder="Enter name" 
            value={name} 
            onChange={(e) => {
              setName(e.target.value);
              if (e.target.value.trim()) setError('');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
            }}
            autoFocus
          />
          {error && (
            <p className="text-sm text-destructive mt-1">{error}</p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryForm;
