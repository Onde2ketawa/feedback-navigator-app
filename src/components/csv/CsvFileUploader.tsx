
import React from 'react';
import { FileUpload } from '@/components/ui/file-upload';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface CsvFileUploaderProps {
  onFilesAccepted: (files: File[]) => void;
  error: string | null;
  disabled?: boolean;
}

export const CsvFileUploader: React.FC<CsvFileUploaderProps> = ({ 
  onFilesAccepted, 
  error, 
  disabled = false 
}) => {
  return (
    <>
      <FileUpload
        onFilesAccepted={onFilesAccepted}
        maxFiles={1}
        disabled={disabled}
      />
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </>
  );
};
