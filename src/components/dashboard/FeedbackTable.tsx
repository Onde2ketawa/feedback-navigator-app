
import React from 'react';
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
  
  const columns = React.useMemo(
    () => createFeedbackColumns({
      categories,
      subcategories,
      openTagDialog,
      setSelectedRows,
      openSentimentDialog,
    }),
    [categories, subcategories, openTagDialog, setSelectedRows, openSentimentDialog]
  );
  
  const visibleColumns = useResponsiveColumns(columns);

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <div className="min-w-full inline-block align-middle px-4 sm:px-0">
        <DataTable 
          columns={visibleColumns} 
          data={data} 
          totalRecords={stats?.totalFeedback}
        />
      </div>
    </div>
  );
};
