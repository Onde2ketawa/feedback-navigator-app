
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

interface CsvPreviewButtonProps {
  onClick: () => void;
  disabled: boolean;
  isProcessing: boolean;
}

export const CsvPreviewButton: React.FC<CsvPreviewButtonProps> = ({
  onClick,
  disabled,
  isProcessing
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || isProcessing}
      className="flex items-center"
    >
      <Eye className="mr-2 h-4 w-4" />
      {isProcessing ? 'Processing...' : 'Preview CSV'}
    </Button>
  );
};
