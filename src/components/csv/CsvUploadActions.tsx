
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { CsvTemplateDownload } from './CsvTemplateDownload';
import { CsvPreviewButton } from './CsvPreviewButton';

interface CsvUploadActionsProps {
  onPreview: () => void;
  onUpload: () => void;
  disablePreview: boolean;
  disableUpload: boolean;
  isProcessing: boolean;
}

export const CsvUploadActions: React.FC<CsvUploadActionsProps> = ({
  onPreview,
  onUpload,
  disablePreview,
  disableUpload,
  isProcessing
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
      <CsvTemplateDownload />
      
      <CsvPreviewButton 
        onClick={onPreview}
        disabled={disablePreview}
        isProcessing={isProcessing}
      />
      
      <Button
        onClick={onUpload}
        disabled={disableUpload || isProcessing}
        className="flex items-center"
      >
        <Upload className="mr-2 h-4 w-4" />
        {isProcessing ? 'Processing...' : 'Upload Data'}
      </Button>
    </div>
  );
};
