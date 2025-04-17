
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
        title: "Tidak ada channel yang dipilih",
        description: "Silakan pilih channel sebelum melakukan preview",
        variant: "destructive",
      });
      return;
    }
    
    if (files.length === 0) {
      toast({
        title: "Tidak ada file yang dipilih",
        description: "Silakan pilih file CSV untuk preview",
        variant: "destructive",
      });
      return;
    }
    
    await processCsvPreview(files[0], selectedChannel);
  };
  
  const handleUpload = async () => {
    if (!selectedChannel) {
      toast({
        title: "Tidak ada channel yang dipilih",
        description: "Silakan pilih channel sebelum mengupload",
        variant: "destructive",
      });
      return;
    }
    
    if (files.length === 0 || csvData.length === 0) {
      toast({
        title: "Tidak ada data untuk diupload",
        description: "Silakan preview dan konfirmasi data CSV terlebih dahulu",
        variant: "destructive",
      });
      return;
    }
    
    const validationResult = validateCsvData(csvData);
    
    if (!validationResult.valid) {
      const firstFiveErrors = validationResult.errorMessages.slice(0, 5);
      const remainingCount = validationResult.errorMessages.length - 5;
      
      let errorMessage = `${firstFiveErrors.join('\n')}`;
      if (remainingCount > 0) {
        errorMessage += `\n...dan ${remainingCount} error lainnya.`;
      }
      
      setError(errorMessage);
      
      toast({
        title: "Error Validasi",
        description: `${validationResult.errorMessages.length} kesalahan ditemukan. Perbaiki kesalahan sebelum mengupload.`,
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Count of valid rows
      const validRowCount = csvData.length - 
        [...new Set([...validationResult.invalidRows, ...validationResult.dateFormatErrors, ...validationResult.nonNumericRatingErrors])].length;
      
      toast({
        title: "Upload berhasil",
        description: `Berhasil mengupload ${validRowCount} baris dari file CSV ke channel yang dipilih`,
      });
      
      setFiles([]);
      resetPreview();
      setIsPreviewOpen(false);
    } catch (err: any) {
      toast({
        title: "Upload gagal",
        description: err.message || "Terjadi kesalahan saat upload",
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
        description="Upload dan proses file CSV untuk entri data batch"
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
