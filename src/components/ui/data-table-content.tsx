
import React from 'react';
import { ColumnDef, flexRender, Table as ReactTable } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface DataTableContentProps<TData, TValue> {
  table: ReactTable<TData>;
  columns: ColumnDef<TData, TValue>[];
}

export function DataTableContent<TData, TValue>({
  table,
  columns,
}: DataTableContentProps<TData, TValue>) {
  return (
    <div className="rounded-md border overflow-hidden">
      <div className="w-full overflow-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead 
                    key={header.id} 
                    className="whitespace-nowrap text-xs sm:text-sm p-2 sm:p-4"
                    style={{ 
                      width: header.getSize() === 0 ? 0 : undefined,
                      minWidth: header.getSize() === 0 ? 0 : undefined,
                      padding: header.getSize() === 0 ? 0 : undefined,
                      overflow: header.getSize() === 0 ? 'hidden' : undefined,
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell 
                      key={cell.id} 
                      className="p-2 sm:p-4 text-xs sm:text-sm"
                      style={{ 
                        width: cell.column.getSize() === 0 ? 0 : undefined,
                        minWidth: cell.column.getSize() === 0 ? 0 : undefined,
                        padding: cell.column.getSize() === 0 ? 0 : undefined,
                        overflow: cell.column.getSize() === 0 ? 'hidden' : undefined,
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
