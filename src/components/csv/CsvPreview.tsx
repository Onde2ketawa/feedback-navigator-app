
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { CsvPreviewActions } from './CsvPreviewActions';
import { useCsvValidation } from '@/hooks/useCsvValidation';
import { ValidationWarningBanner } from './ValidationWarningBanner';
import { CsvSearchBox } from './CsvSearchBox';
import { CsvDataSummary } from './CsvDataSummary';
import { CsvDataTable } from './CsvDataTable';
import { CsvPagination } from './CsvPagination';

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
            <ValidationWarningBanner errorCount={validationResults.errorMessages.length} />
          )}
          
          {/* Search box */}
          <CsvSearchBox 
            search={search} 
            onSearchChange={handleSearch} 
            onClearSearch={clearSearch} 
          />
          
          {/* Data summary */}
          <CsvDataSummary 
            startIndex={startIndex}
            itemsPerPage={itemsPerPage}
            filteredDataLength={filteredData.length}
            totalDataLength={data.length}
            hasSearch={!!search}
          />
          
          {/* Table */}
          <CsvDataTable 
            columns={columns}
            paginatedData={paginatedData}
            startIndex={startIndex}
            isInvalidRow={isInvalidRow}
          />
          
          {/* Pagination */}
          <CsvPagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevPage={handlePrevPage}
            onNextPage={handleNextPage}
          />
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
