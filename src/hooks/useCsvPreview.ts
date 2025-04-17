
import { useState } from 'react';
import { parseCsvFile } from '@/utils/csv-utils';
import { useToast } from '@/hooks/use-toast';

interface UseCsvPreviewResult {
  csvData: any[];
  columns: string[];
  isProcessing: boolean;
  error: string | null;
  isPreviewOpen: boolean;
  handlePreview: (file: File, selectedChannel: string) => Promise<void>;
  setIsPreviewOpen: (isOpen: boolean) => void;
  resetPreview: () => void;
}

export const useCsvPreview = (): UseCsvPreviewResult => {
  const [csvData, setCsvData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { toast } = useToast();

  const handlePreview = async (file: File, selectedChannel: string) => {
    if (!selectedChannel) {
      toast({
        title: "No channel selected",
        description: "Please select a channel before previewing",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const { data, headers, error } = await parseCsvFile(file);
      
      if (error) {
        setError(error);
        toast({
          title: "Error parsing CSV",
          description: error,
          variant: "destructive",
        });
        return;
      }
      
      setCsvData(data);
      setColumns(headers);
      setIsPreviewOpen(true);
    } catch (err: any) {
      setError(err.message || "Failed to parse CSV file");
      toast({
        title: "Error",
        description: "Failed to parse the CSV file",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetPreview = () => {
    setCsvData([]);
    setColumns([]);
    setIsPreviewOpen(false);
    setError(null);
  };

  return {
    csvData,
    columns,
    isProcessing,
    error,
    isPreviewOpen,
    handlePreview,
    setIsPreviewOpen,
    resetPreview
  };
};
