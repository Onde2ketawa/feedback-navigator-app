
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Search, X, AlertTriangle } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { CsvPreviewActions } from './CsvPreviewActions';
import { useCsvValidation } from '@/hooks/useCsvValidation';

interface CsvPreviewProps {
  data: any[];
  columns: string[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isProcessing: boolean;
  onConfirm: () => void;
}

export const CsvPreview: React.FC<CsvPreviewProps> = ({ 
  data, 
  columns, 
  isOpen, 
  onOpenChange, 
  isProcessing, 
  onConfirm 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [validationResults, setValidationResults] = useState<any>({ 
    invalidRows: [], 
    valid: true,
    errorMessages: [],
    dateFormatErrors: [],
    nonNumericRatingErrors: []
  });
  const { validateCsvData } = useCsvValidation();
  const itemsPerPage = 10;
  
  // Validate data when it changes
  useEffect(() => {
    if (data.length > 0) {
      const results = validateCsvData(data);
      setValidationResults(results);
    }
  }, [data]);
  
  // Filter data based on search term
  const filteredData = search 
    ? data.filter(row => 
        Object.values(row).some(
          value => value && value.toString().toLowerCase().includes(search.toLowerCase())
        )
      )
    : data;
    
  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);
  
  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };
  
  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };
  
  const clearSearch = () => {
    setSearch('');
    setCurrentPage(1);
  };

  // Check if a row has validation errors
  const isInvalidRow = (rowIndex: number) => {
    return (
      validationResults.invalidRows.includes(startIndex + rowIndex) ||
      validationResults.dateFormatErrors.includes(startIndex + rowIndex) ||
      validationResults.nonNumericRatingErrors.includes(startIndex + rowIndex)
    );
  };

  // Calculate valid row count
  const validRowCount = data.length - 
    [...new Set([...validationResults.invalidRows, ...validationResults.dateFormatErrors, ...validationResults.nonNumericRatingErrors])].length;
  
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-3xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>CSV Preview</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          {/* Validation warning */}
          {!validationResults.valid && (
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-4">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                <div>
                  <p className="font-medium text-amber-700">Peringatan Validasi</p>
                  <p className="text-sm text-amber-700">
                    Ditemukan {validationResults.errorMessages.length} kesalahan di data CSV.
                    Baris yang bermasalah ditandai di bawah ini. Perbaiki semua error sebelum melanjutkan.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Search box */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari..."
              value={search}
              onChange={handleSearch}
              className="pl-8 pr-8"
            />
            {search && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-9 w-9 p-0"
                onClick={clearSearch}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Hapus pencarian</span>
              </Button>
            )}
          </div>
          
          {/* Data summary */}
          <div className="text-sm text-muted-foreground mt-4">
            Menampilkan {paginatedData.length > 0 ? startIndex + 1 : 0} sampai {Math.min(startIndex + itemsPerPage, filteredData.length)} dari {filteredData.length} baris
            {search && ` (difilter dari ${data.length} total baris)`}
          </div>
          
          {/* Table */}
          <div className="rounded-md border mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">#</TableHead>
                  {columns.map((column) => (
                    <TableHead key={column}>
                      {column}
                      {(column === 'rating' || column === 'submitDate') && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((row, index) => (
                    <TableRow 
                      key={index}
                      className={isInvalidRow(index) ? "bg-red-50" : ""}
                    >
                      <TableCell className="text-center font-medium">
                        {startIndex + index + 1}
                        {isInvalidRow(index) && (
                          <span className="ml-1 text-red-500">
                            <AlertTriangle className="h-4 w-4 inline" />
                          </span>
                        )}
                      </TableCell>
                      {columns.map((column) => (
                        <TableCell 
                          key={`${index}-${column}`}
                          className={
                            (column === 'rating' && 
                             (!row[column] || row[column] === '' || isNaN(Number(row[column])))) || 
                            (column === 'submitDate' && 
                             (!row[column] || row[column] === '' || 
                              (!/^\d{4}-\d{2}-\d{2}$/.test(row[column]) && !isNaN(Date.parse(row[column]))))) ? 
                            "text-red-500" : ""
                          }
                        >
                          {row[column]?.toString() || (
                            <span className="text-red-500 italic">kosong</span>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                      Tidak ada data tersedia
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-end space-x-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Halaman sebelumnya</span>
              </Button>
              <div className="text-sm">
                Halaman {currentPage} dari {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Halaman berikutnya</span>
              </Button>
            </div>
          )}
        </div>
        
        {/* Actions */}
        <CsvPreviewActions 
          onConfirm={onConfirm} 
          isProcessing={isProcessing} 
          hasValidationErrors={!validationResults.valid}
          errorCount={validationResults.errorMessages.length}
          errorMessages={validationResults.errorMessages}
          validRowCount={validRowCount}
          totalRowCount={data.length}
        />
      </SheetContent>
    </Sheet>
  );
};
