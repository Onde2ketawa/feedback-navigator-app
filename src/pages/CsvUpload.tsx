
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Sheet } from '@/components/ui/sheet';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';

// Import our components and hooks
import { CsvPreview } from '@/components/csv/CsvPreview';
import { ChannelSelector } from '@/components/csv/ChannelSelector';
import { CsvRequirements } from '@/components/csv/CsvRequirements';
import { CsvFileUploader } from '@/components/csv/CsvFileUploader';
import { CsvUploadActions } from '@/components/csv/CsvUploadActions';
import { useCsvValidation } from '@/hooks/useCsvValidation';
import { useCsvPreview } from '@/hooks/useCsvPreview';

const CsvUpload: React.FC = () => {
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { validateCsvData } = useCsvValidation();
  const { 
    csvData, 
    columns, 
    isPreviewOpen, 
    setIsPreviewOpen,
    handlePreview: processCsvPreview,
    resetPreview
  } = useCsvPreview();
  
  const handleFilesAccepted = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    setError(null);
    resetPreview();
  };
  
  const handlePreview = async () => {
    if (!selectedChannel) {
      toast({
        title: "No channel selected",
        description: "Please select a channel before previewing",
        variant: "destructive",
      });
      return;
    }
    
    if (files.length === 0) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to preview",
        variant: "destructive",
      });
      return;
    }
    
    await processCsvPreview(files[0], selectedChannel);
  };
  
  const handleUpload = async () => {
    if (!selectedChannel) {
      toast({
        title: "No channel selected",
        description: "Please select a channel before uploading",
        variant: "destructive",
      });
      return;
    }
    
    if (files.length === 0 || csvData.length === 0) {
      toast({
        title: "No data to upload",
        description: "Please preview and confirm the CSV data first",
        variant: "destructive",
      });
      return;
    }
    
    const { valid, invalidRows } = validateCsvData(csvData);
    
    if (!valid) {
      setError(`Missing required fields in ${invalidRows.length} rows. Rating and Submit Date are required fields.`);
      toast({
        title: "Validation Error",
        description: `Missing required fields in rows: ${invalidRows.slice(0, 5).map(i => i + 1).join(', ')}${invalidRows.length > 5 ? '...' : ''}. Rating and Submit Date are required.`,
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Upload successful",
        description: `Uploaded ${csvData.length} records from CSV file to the selected channel`,
      });
      
      setFiles([]);
      resetPreview();
      setIsPreviewOpen(false);
    } catch (err: any) {
      toast({
        title: "Upload failed",
        description: err.message || "An error occurred during upload",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="CSV Upload" 
        description="Upload and process CSV files for batch data entry"
      />
      
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <ChannelSelector 
              value={selectedChannel}
              onChange={setSelectedChannel}
            />
            
            <CsvFileUploader
              onFilesAccepted={handleFilesAccepted}
              error={error}
              disabled={isProcessing || !selectedChannel}
            />
            
            <CsvRequirements />

            <CsvUploadActions
              onPreview={handlePreview}
              onUpload={handleUpload}
              disablePreview={files.length === 0 || !selectedChannel}
              disableUpload={csvData.length === 0 || !selectedChannel}
              isProcessing={isProcessing}
            />
          </div>
        </CardContent>
      </Card>

      <CsvPreview 
        data={csvData}
        columns={columns}
        isOpen={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        isProcessing={isProcessing}
        onConfirm={handleUpload}
      />
    </div>
  );
};

export default CsvUpload;
