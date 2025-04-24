
import React, { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { LoadingState } from '@/components/dashboard/LoadingState';
import { ErrorState } from '@/components/dashboard/ErrorState';
import { FeedbackFilter } from '@/hooks/useFeedbackData';
import { Feedback } from '@/models/feedback';

interface FeedbackDataWrapperProps {
  feedbackData: Feedback[] | undefined;
  isLoading: boolean;
  error: unknown;
  filter: FeedbackFilter;
  children: React.ReactNode;
}

export const FeedbackDataWrapper: React.FC<FeedbackDataWrapperProps> = ({
  feedbackData,
  isLoading,
  error,
  filter,
  children
}) => {
  const { toast } = useToast();
  
  // Effect to show toast when data is empty
  useEffect(() => {
    if (feedbackData && feedbackData.length === 0 && !isLoading && !error) {
      // Only show the toast if filters have been applied (not on initial load)
      if (filter.channel || filter.year !== 'all' || filter.month !== 'all') {
        toast({
          title: "No Results Found",
          description: "No feedback matches the selected filters. Try adjusting your criteria.",
          variant: "default"
        });
      }
    }
  }, [feedbackData, isLoading, error, filter, toast]);

  // Log component state for debugging
  useEffect(() => {
    console.log("FeedbackDataWrapper state:", { 
      isLoading, 
      hasError: !!error, 
      dataCount: feedbackData?.length || 0,
      filters: filter
    });
  }, [feedbackData, isLoading, error, filter]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    console.error("Error in FeedbackDataWrapper:", error);
    return <ErrorState error={error as Error} />;
  }
  
  return <>{children}</>;
};
