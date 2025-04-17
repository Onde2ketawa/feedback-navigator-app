
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, AlertCircle } from 'lucide-react';

interface CsvPreviewActionsProps {
  onConfirm: () => void;
  isProcessing: boolean;
  hasValidationErrors?: boolean;
  errorCount?: number;
}

export const CsvPreviewActions: React.FC<CsvPreviewActionsProps> = ({
  onConfirm,
  isProcessing,
  hasValidationErrors = false,
  errorCount = 0
}) => {
  return (
    <div className="mt-6 flex justify-end space-x-3">
      <div className={`flex-1 text-sm ${hasValidationErrors ? 'text-red-600' : 'text-amber-600'} mr-2`}>
        <AlertCircle className="inline-block mr-1 h-4 w-4" />
        {hasValidationErrors ? (
          <span>
            <strong>{errorCount} rows</strong> have missing required fields (Rating, Submit Date).
            Please correct them before confirming.
          </span>
        ) : (
          <span>
            Please ensure all required fields (Rating, Submit Date) are filled before confirming.
          </span>
        )}
      </div>
      <Button 
        onClick={onConfirm} 
        disabled={isProcessing}
        variant={hasValidationErrors ? "outline" : "default"}
      >
        <Upload className="mr-2 h-4 w-4" />
        {isProcessing ? 'Processing...' : 'Confirm Upload'}
      </Button>
    </div>
  );
};
