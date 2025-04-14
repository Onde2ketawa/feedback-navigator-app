
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FeedbackSortSection } from '@/components/dashboard/FeedbackSortSection';
import { FeedbackTable } from '@/components/dashboard/FeedbackTable';
import { Feedback } from '@/models/feedback';
import { FeedbackFilter } from '@/hooks/useFeedbackData';

interface DashboardContentProps {
  feedbackData: Feedback[];
  selectedRows: string[];
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
  openTagDialog: (feedback: Feedback) => void;
  onFilterChange: (filters: FeedbackFilter) => void;
  categories: { id: string; name: string }[];
  subcategories: { id: string; name: string }[];
}

export function DashboardContent({
  feedbackData,
  selectedRows,
  setSelectedRows,
  openTagDialog,
  onFilterChange,
  categories,
  subcategories
}: DashboardContentProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div className="md:col-span-1">
        <FeedbackSortSection onFilterChange={onFilterChange} />
      </div>
      <div className="md:col-span-3">
        <Card>
          <CardContent className="pt-6">
            <FeedbackTable
              data={feedbackData}
              categories={categories}
              subcategories={subcategories}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              openTagDialog={openTagDialog}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
