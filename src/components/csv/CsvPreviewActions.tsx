
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, AlertCircle } from 'lucide-react';

interface CsvPreviewActionsProps {
  onConfirm: () => void;
  isProcessing: boolean;
}

export const CsvPreviewActions: React.FC<CsvPreviewActionsProps> = ({
  onConfirm,
  isProcessing
}) => {
  return (
    <div className="mt-6 flex justify-end space-x-3">
      <div className="flex-1 text-sm text-amber-600 mr-2">
        <AlertCircle className="inline-block mr-1 h-4 w-4" />
        Please ensure all required fields (Rating, Submit Date) are filled before confirming.
      </div>
      <Button onClick={onConfirm} disabled={isProcessing}>
        <Upload className="mr-2 h-4 w-4" />
        {isProcessing ? 'Processing...' : 'Confirm Upload'}
      </Button>
    </div>
  );
};
