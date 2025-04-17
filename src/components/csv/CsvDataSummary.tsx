
import React from 'react';

interface CsvDataSummaryProps {
  startIndex: number;
  itemsPerPage: number;
  filteredDataLength: number;
  totalDataLength: number;
  hasSearch: boolean;
}

export const CsvDataSummary: React.FC<CsvDataSummaryProps> = ({
  startIndex,
  itemsPerPage,
  filteredDataLength,
  totalDataLength,
  hasSearch
}) => {
  return (
    <div className="text-sm text-muted-foreground mt-4">
      Menampilkan {filteredDataLength > 0 ? startIndex + 1 : 0} sampai {Math.min(startIndex + itemsPerPage, filteredDataLength)} dari {filteredDataLength} baris
      {hasSearch && ` (difilter dari ${totalDataLength} total baris)`}
    </div>
  );
};
