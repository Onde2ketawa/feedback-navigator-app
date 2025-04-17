
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CsvPreviewActionsProps {
  onConfirm: () => void;
  isProcessing: boolean;
  hasValidationErrors?: boolean;
  errorCount?: number;
  errorMessages?: string[];
  validRowCount?: number;
  totalRowCount?: number;
}

export const CsvPreviewActions: React.FC<CsvPreviewActionsProps> = ({
  onConfirm,
  isProcessing,
  hasValidationErrors = false,
  errorCount = 0,
  errorMessages = [],
  validRowCount = 0,
  totalRowCount = 0
}) => {
  return (
    <div className="mt-6 space-y-4">
      {hasValidationErrors ? (
        <Alert variant="destructive" className="text-sm">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription className="space-y-2">
            <p className="font-semibold">
              Ditemukan {errorCount} kesalahan validasi:
            </p>
            <ul className="list-disc pl-5 space-y-1 max-h-32 overflow-y-auto">
              {errorMessages.slice(0, 5).map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
              {errorMessages.length > 5 && (
                <li>...dan {errorMessages.length - 5} error lainnya</li>
              )}
            </ul>
            <p>
              Hanya {validRowCount} dari {totalRowCount} baris yang valid. 
              Mohon perbaiki error sebelum mengkonfirmasi.
            </p>
          </AlertDescription>
        </Alert>
      ) : (
        <div className="bg-green-50 border-l-4 border-green-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                File CSV valid. {validRowCount} baris siap diproses. Kolom 'rating' dan 'submit_date' terisi lengkap.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-end">
        <Button 
          onClick={onConfirm} 
          disabled={isProcessing || hasValidationErrors}
          variant={hasValidationErrors ? "outline" : "default"}
        >
          <Upload className="mr-2 h-4 w-4" />
          {isProcessing ? 'Memproses...' : 'Konfirmasi Upload'}
        </Button>
      </div>
    </div>
  );
};
