
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CsvPaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export const CsvPagination: React.FC<CsvPaginationProps> = ({
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage
}) => {
  if (totalPages <= 1) {
    return null;
  }
  
  return (
    <div className="flex items-center justify-end space-x-2 mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={onPrevPage}
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
        onClick={onNextPage}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Halaman berikutnya</span>
      </Button>
    </div>
  );
};
