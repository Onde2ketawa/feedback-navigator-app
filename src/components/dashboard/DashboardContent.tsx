
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
    <div className="grid grid-cols-1 gap-4 lg:gap-6">
      <div className="w-full">
        <FeedbackSortSection onFilterChange={onFilterChange} />
      </div>
      <div className="w-full">
        <Card className="shadow-sm">
          <CardContent className="p-2 sm:p-4 md:p-6 overflow-x-auto">
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
