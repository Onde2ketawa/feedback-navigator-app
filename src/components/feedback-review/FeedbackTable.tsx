
import React from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Card, CardContent } from '@/components/ui/card';
import type { FeedbackData, SortField } from '@/hooks/useFeedbackReview';
import { createFeedbackColumns } from './table/FeedbackColumns';

interface FeedbackTableProps {
  data: FeedbackData[];
  sortField: SortField;
  sortOrder: 'asc' | 'desc';
  onSort: (field: SortField) => void;
}

export function FeedbackTable({ data, sortField, sortOrder, onSort }: FeedbackTableProps) {
  const columns = React.useMemo(
    () => createFeedbackColumns({ sortField, sortOrder, onSort }),
    [sortField, sortOrder, onSort]
  );

  return (
    <div className="overflow-hidden">
      <Card className="border rounded-lg">
        <CardContent className="p-1 sm:p-2 md:p-4 lg:p-6">
          <div className="overflow-x-auto">
            <DataTable 
              columns={columns} 
              data={data || []} 
              totalRecords={data?.length || 0}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
