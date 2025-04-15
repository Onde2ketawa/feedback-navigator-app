
import React, { useState } from 'react';
import { FileUpload } from '@/components/ui/file-upload';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, FileCheck, Upload } from 'lucide-react';
import { useCategories } from '@/hooks/categories';
import { CsvPreview } from '@/components/csv/CsvPreview';
import { parseCsvFile } from '@/utils/csv-utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

const CsvUpload: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { categories } = useCategories();
  
  const handleFilesAccepted = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    setError(null);
    
    // Reset preview data when new files are selected
    setCsvData([]);
    setColumns([]);
  };
  
  const handlePreview = async () => {
    if (files.length === 0) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to preview",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // Parse the first file
      const file = files[0];
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
  
  const handleUpload = async () => {
    if (files.length === 0 || csvData.length === 0) {
      toast({
        title: "No data to upload",
        description: "Please preview and confirm the CSV data first",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Here you would call your API to upload the CSV data
      // For now, we'll just simulate a successful upload
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Upload successful",
        description: `Uploaded ${csvData.length} records from CSV file`,
      });
      
      // Reset the form after successful upload
      setFiles([]);
      setCsvData([]);
      setColumns([]);
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
            <FileUpload
              onFilesAccepted={handleFilesAccepted}
              maxFiles={1}
              disabled={isProcessing}
            />
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
              <Button
                variant="outline"
                onClick={handlePreview}
                disabled={files.length === 0 || isProcessing}
              >
                <FileCheck className="mr-2 h-4 w-4" />
                Preview CSV
              </Button>
              
              <Button
                onClick={handleUpload}
                disabled={csvData.length === 0 || isProcessing}
                className="flex items-center"
              >
                <Upload className="mr-2 h-4 w-4" />
                {isProcessing ? 'Processing...' : 'Upload Data'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Sheet open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <SheetContent className="w-full sm:max-w-3xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>CSV Preview</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <CsvPreview data={csvData} columns={columns} />
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={handleUpload} disabled={isProcessing}>
              <Upload className="mr-2 h-4 w-4" />
              {isProcessing ? 'Processing...' : 'Confirm Upload'}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CsvUpload;
