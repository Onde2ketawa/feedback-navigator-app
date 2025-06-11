
import React from 'react';
import { BulkActionButtons } from '@/components/dashboard/BulkActionButtons';
import { useToast } from '@/hooks/use-toast';
import { FeedbackFilter } from '@/hooks/useFeedbackData';
import { QueryObserverResult } from '@tanstack/react-query';
import { Feedback } from '@/models/feedback';

interface DashboardActionsProps {
  selectedRows: string[];
  filter: FeedbackFilter;
  onRefetch: () => Promise<QueryObserverResult<Feedback[], Error>>;
}

export const DashboardActions: React.FC<DashboardActionsProps> = ({
  selectedRows,
  filter,
  onRefetch
}) => {
  const { toast } = useToast();

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your data is being prepared for export.",
    });
  };
  
  const handleBulkTag = () => {
    toast({
      title: "Bulk Tagging",
      description: `${selectedRows.length} rows selected for tagging.`,
    });
  };

  return (
    <div className="flex gap-2">
      <BulkActionButtons 
        selectedRows={selectedRows} 
        onExport={handleExport} 
        onBulkTag={handleBulkTag} 
      />
    </div>
  );
};
