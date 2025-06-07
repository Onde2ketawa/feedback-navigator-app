
import React, { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Feedback } from '@/models/feedback';
import { createFeedbackColumns } from './table/FeedbackColumns';
import { useResponsiveColumns } from './table/useResponsiveColumns';
import { useFeedbackStats } from '@/hooks/useFeedbackStats';
import { FeedbackFilter } from '@/hooks/useFeedbackData';

interface FeedbackTableProps {
  data: Feedback[];
  categories: { id: string; name: string }[];
  subcategories: { id: string; name: string }[];
  selectedRows: string[];
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
  openTagDialog: (feedback: Feedback) => void;
  openSentimentDialog: (feedback: Feedback) => void;
  filter?: FeedbackFilter;
}

export const FeedbackTable: React.FC<FeedbackTableProps> = ({
  data,
  categories,
  subcategories,
  selectedRows,
  setSelectedRows,
  openTagDialog,
  openSentimentDialog,
  filter,
}) => {
  const { data: stats } = useFeedbackStats(filter);
  const [sortField, setSortField] = useState<string>('submitDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };
  
  const columns = React.useMemo(
    () => createFeedbackColumns({
      categories,
      subcategories,
      openTagDialog,
      setSelectedRows,
      openSentimentDialog,
      sortField,
      sortOrder,
      onSort: handleSort,
    }),
    [categories, subcategories, openTagDialog, setSelectedRows, openSentimentDialog, sortField, sortOrder]
  );
  
  const visibleColumns = useResponsiveColumns(columns);

  // Sort the data based on current sort state
  const sortedData = React.useMemo(() => {
    if (!sortField) return data;

    return [...data].sort((a, b) => {
      let aValue = a[sortField as keyof Feedback];
      let bValue = b[sortField as keyof Feedback];

      // Handle null/undefined values
      if (aValue == null) aValue = '';
      if (bValue == null) bValue = '';

      // Convert to string for comparison
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      if (sortOrder === 'asc') {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });
  }, [data, sortField, sortOrder]);

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <div className="min-w-full inline-block align-middle px-4 sm:px-0">
        <DataTable 
          columns={visibleColumns} 
          data={sortedData} 
          totalRecords={stats?.totalFeedback}
        />
      </div>
    </div>
  );
};
