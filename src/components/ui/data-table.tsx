
import React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import { DataTableContent } from '@/components/ui/data-table-content';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination?: boolean;
  filtering?: boolean;
  pageCount?: number;
  onPaginationChange?: (pageIndex: number, pageSize: number) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination = true,
  filtering = true,
  pageCount,
  onPaginationChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: pagination ? require('@tanstack/react-table').getPaginationRowModel() : undefined,
    onSortingChange: setSorting,
    getSortedRowModel: require('@tanstack/react-table').getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: filtering ? require('@tanstack/react-table').getFilteredRowModel() : undefined,
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

  return (
    <div>
      <DataTableContent table={table} columns={columns} />
      {pagination && <DataTablePagination table={table} />}
    </div>
  );
}
