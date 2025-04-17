
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AlertTriangle } from 'lucide-react';

interface CsvDataTableProps {
  columns: string[];
  paginatedData: any[];
  startIndex: number;
  isInvalidRow: (rowIndex: number) => boolean;
}

export const CsvDataTable: React.FC<CsvDataTableProps> = ({
  columns,
  paginatedData,
  startIndex,
  isInvalidRow
}) => {
  return (
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
  );
};
