
import React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import { DataTableContent } from '@/components/ui/data-table-content';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination?: boolean;
  filtering?: boolean;
  pageCount?: number;
  onPaginationChange?: (pageIndex: number, pageSize: number) => void;
  onPageChange?: (pageData: TData[]) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination = true,
  filtering = true,
  pageCount,
  onPaginationChange,
  onPageChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: pagination ? getPaginationRowModel() : undefined,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: filtering ? getFilteredRowModel() : undefined,
    manualPagination: !!onPaginationChange,
    pageCount: pageCount,
    state: {
      sorting,
      columnFilters,
    },
  });

  React.useEffect(() => {
    if (onPaginationChange) {
      onPaginationChange(
        table.getState().pagination.pageIndex,
        table.getState().pagination.pageSize
      );
    }
  }, [
    table.getState().pagination.pageIndex,
    table.getState().pagination.pageSize,
    onPaginationChange,
  ]);

  // Add effect to call onPageChange with current page data
  React.useEffect(() => {
    if (onPageChange) {
      const pageData = table.getRowModel().rows.map(row => row.original);
      onPageChange(pageData);
    }
  }, [table.getRowModel().rows, onPageChange]);

  return (
    <div>
      <DataTableContent table={table} columns={columns} />
      {pagination && <DataTablePagination table={table} />}
    </div>
  );
}
