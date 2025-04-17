import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CSV_UPLOAD_TEMPLATE } from '@/utils/csv-utils';
import { useToast } from '@/hooks/use-toast';
import { FileDownload } from 'lucide-react';
import { useCategories } from '@/hooks/categories';
import { CsvPreview } from '@/components/csv/CsvPreview';
import { parseCsvFile } from '@/utils/csv-utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ChannelSelector } from '@/components/csv/ChannelSelector';

const CsvUpload: React.FC = () => {
  const [selectedChannel, setSelectedChannel] = useState<string>('');
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
    
    setCsvData([]);
    setColumns([]);
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
    
    setIsProcessing(true);
    setError(null);
    
    try {
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
  
  const validateCsvData = (data: any[]): { valid: boolean; invalidRows: number[] } => {
    const invalidRows: number[] = [];
    
    data.forEach((row, index) => {
      if (!row.rating || row.rating === '' || !row.submitDate || row.submitDate === '') {
        invalidRows.push(index);
      }
    });
    
    return {
      valid: invalidRows.length === 0,
      invalidRows
    };
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
            
            <FileUpload
              onFilesAccepted={handleFilesAccepted}
              maxFiles={1}
              disabled={isProcessing || !selectedChannel}
            />
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4" role="alert">
              <p className="font-bold">CSV Upload Requirements:</p>
              <ul className="list-disc list-inside text-sm text-yellow-700">
                <li><strong>Rating</strong> (required): Numeric rating value</li>
                <li><strong>Submit Date</strong> (required): Date of feedback submission</li>
                <li><strong>Feedback</strong> (optional): Additional feedback text</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
              <Button
                variant="outline"
                onClick={handleDownloadTemplate}
                className="flex items-center"
              >
                <FileDownload className="mr-2 h-4 w-4" />
                Download CSV Template
              </Button>
              
              <Button
                onClick={handlePreview}
                disabled={files.length === 0 || isProcessing || !selectedChannel}
              >
                <FileCheck className="mr-2 h-4 w-4" />
                Preview CSV
              </Button>
              
              <Button
                onClick={handleUpload}
                disabled={csvData.length === 0 || isProcessing || !selectedChannel}
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
