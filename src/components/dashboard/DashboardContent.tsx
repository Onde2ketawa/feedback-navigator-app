
import React from 'react';
import { FeedbackSortSection } from './FeedbackSortSection';
import { FeedbackTableContainer } from './FeedbackTableContainer';
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
  filter?: FeedbackFilter;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({
  feedbackData,
  selectedRows,
  setSelectedRows,
  openTagDialog,
  onFilterChange,
  categories,
  subcategories,
  filter,
}) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <FeedbackSortSection 
        onFilterChange={onFilterChange}
        categories={categories}
        subcategories={subcategories}
      />
      
      <FeedbackTableContainer
        feedbackData={feedbackData}
        categories={categories}
        subcategories={subcategories}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        openTagDialog={openTagDialog}
        filter={filter}
      />
    </div>
  );
};
