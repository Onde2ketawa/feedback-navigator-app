
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
    <Card>
      <CardContent className="p-6">
        <DataTable columns={columns} data={data || []} />
      </CardContent>
    </Card>
  );
}
