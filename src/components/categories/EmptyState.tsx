
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tag, Plus } from 'lucide-react';

interface EmptyStateProps {
  onAddCategory: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddCategory }) => {
  return (
    <Card className="bg-muted/50">
      <CardContent className="flex flex-col items-center justify-center py-10">
        <Tag className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No categories yet</h3>
        <p className="text-muted-foreground text-center mb-4">
          Create categories to organize and classify your feedback.
        </p>
        <Button onClick={onAddCategory}>
          <Plus className="mr-2 h-4 w-4" />
          Add Your First Category
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
