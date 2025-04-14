
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BulkActionButtonsProps {
  selectedRows: string[];
  onExport: () => void;
  onBulkTag: () => void;
}

export const BulkActionButtons: React.FC<BulkActionButtonsProps> = ({
  selectedRows,
  onExport,
  onBulkTag,
}) => {
  const { toast } = useToast();

  const handleBulkTag = () => {
    if (selectedRows.length === 0) {
      toast({
        title: "No rows selected",
        description: "Please select at least one row to tag.",
        variant: "destructive",
      });
      return;
    }
    
    onBulkTag();
  };

  return (
    <>
      <Button onClick={handleBulkTag} className="flex items-center" variant="outline">
        <Tag className="mr-2 h-4 w-4" />
        <span>Bulk Tag</span>
      </Button>
      <Button onClick={onExport} className="flex items-center">
        <Download className="mr-2 h-4 w-4" />
        <span>Export</span>
      </Button>
    </>
  );
};
