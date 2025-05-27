
import React from 'react';
import { Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  totalRecords?: number;
}

export function DataTablePagination<TData>({
  table,
  totalRecords,
}: DataTablePaginationProps<TData>) {
  const currentPageSize = table.getState().pagination.pageSize;
  const currentPageIndex = table.getState().pagination.pageIndex;
  const totalRows = totalRecords || table.getFilteredRowModel().rows.length;
  const startIndex = currentPageIndex * currentPageSize + 1;
  const endIndex = Math.min((currentPageIndex + 1) * currentPageSize, totalRows);
  
  return (
    <div className="flex items-center justify-between space-x-2 py-4">
      <div className="flex items-center space-x-2">
        <p className="text-sm font-medium">Rows per page</p>
        <Select
          value={`${currentPageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={currentPageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex-1 text-sm text-muted-foreground">
          Showing {startIndex}-{endIndex} of {totalRows.toLocaleString('id-ID')} total records
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <span className="flex items-center gap-1 text-sm">
          <div>Page</div>
          <strong>
            {currentPageIndex + 1} of{' '}
            {Math.ceil(totalRows / currentPageSize)}
          </strong>
        </span>
      </div>
    </div>
  );
}
