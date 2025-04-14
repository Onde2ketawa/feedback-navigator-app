
import React, { useState } from 'react';
import { FormLabel } from '@/components/ui/form';
import { FileUpload } from '@/components/ui/file-upload';

export const FileUploadSection: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="space-y-2">
      <FormLabel>Upload File</FormLabel>
      <FileUpload onFilesAccepted={setFiles} />
    </div>
  );
};
