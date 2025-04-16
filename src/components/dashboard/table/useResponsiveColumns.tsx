
import { useCallback, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { useIsMobile } from '@/hooks/use-mobile';

export function useResponsiveColumns<T>(columns: ColumnDef<T>[]) {
  const isMobile = useIsMobile();
  
  // Helper to get column ID consistently
  const getColumnId = useCallback((column: ColumnDef<T>) => {
    return column.id || (column as any).accessorKey as string;
  }, []);
  
  // Columns to hide on mobile
  const hiddenMobileColumns = [
    "submitTime", 
    "device", 
    "appVersion", 
    "language", 
    "sentiment_score"
  ];
  
  // Apply visibility based on screen size
  const visibleColumns = useMemo(() => {
    if (isMobile) {
      return columns.map(column => {
        const columnId = getColumnId(column);
        if (hiddenMobileColumns.includes(columnId)) {
          return {
            ...column,
            size: 0,
            minSize: 0,
          };
        }
        return column;
      });
    }
    return columns;
  }, [columns, isMobile, getColumnId, hiddenMobileColumns]);
  
  return visibleColumns;
}
