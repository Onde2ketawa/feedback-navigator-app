
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { CSV_UPLOAD_TEMPLATE } from '@/utils/csv-utils';

export const CsvTemplateDownload: React.FC = () => {
  const handleDownloadTemplate = () => {
    const blob = new Blob([CSV_UPLOAD_TEMPLATE], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'feedback_upload_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <Button
      variant="outline"
      onClick={handleDownloadTemplate}
      className="flex items-center"
    >
      <Download className="mr-2 h-4 w-4" />
      Download CSV Template
    </Button>
  );
};
