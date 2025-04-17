
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface CsvPreviewActionsProps {
  onConfirm: () => void;
  isProcessing: boolean;
}

export const CsvPreviewActions: React.FC<CsvPreviewActionsProps> = ({
  onConfirm,
  isProcessing
}) => {
  return (
    <div className="mt-6 flex justify-end">
      <Button onClick={onConfirm} disabled={isProcessing}>
        <Upload className="mr-2 h-4 w-4" />
        {isProcessing ? 'Processing...' : 'Confirm Upload'}
      </Button>
    </div>
  );
};
