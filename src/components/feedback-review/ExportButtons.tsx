
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileExcel, FilePdf } from 'lucide-react';
import { FeedbackData } from '@/hooks/useFeedbackReview';
import { exportToExcel, exportToPDF } from '@/utils/export-utils';
import { useToast } from '@/hooks/use-toast';

interface ExportButtonsProps {
  data: FeedbackData[];
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({ data }) => {
  const { toast } = useToast();

  const handleExport = (type: 'excel' | 'pdf') => {
    try {
      if (data.length === 0) {
        toast({
          title: "No data to export",
          description: "Please make sure there is data available to export.",
          variant: "destructive",
        });
        return;
      }

      if (type === 'excel') {
        exportToExcel(data);
      } else {
        exportToPDF(data);
      }

      toast({
        title: "Export successful",
        description: `Data has been exported to ${type.toUpperCase()} format.`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "An error occurred while exporting the data.",
        variant: "destructive",
      });
      console.error('Export error:', error);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={() => handleExport('excel')}
        className="flex items-center gap-2"
      >
        <FileExcel className="h-4 w-4" />
        Export to Excel
      </Button>
      <Button
        variant="outline"
        onClick={() => handleExport('pdf')}
        className="flex items-center gap-2"
      >
        <FilePdf className="h-4 w-4" />
        Export to PDF
      </Button>
    </div>
  );
};
