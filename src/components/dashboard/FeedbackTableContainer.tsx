
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FeedbackTable } from '@/components/dashboard/FeedbackTable';
import { Feedback } from '@/models/feedback';

interface FeedbackTableContainerProps {
  feedbackData: Feedback[];
  categories: { id: string; name: string }[];
  subcategories: { id: string; name: string }[];
  selectedRows: string[];
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
  openTagDialog: (feedback: Feedback) => void;
}

export const FeedbackTableContainer: React.FC<FeedbackTableContainerProps> = ({
  feedbackData,
  categories,
  subcategories,
  selectedRows,
  setSelectedRows,
  openTagDialog,
}) => {
  return (
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
  );
};
