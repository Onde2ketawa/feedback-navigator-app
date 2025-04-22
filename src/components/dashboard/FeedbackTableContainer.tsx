
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FeedbackTable } from '@/components/dashboard/FeedbackTable';
import { Feedback } from '@/models/feedback';
import { SentimentEditDialog } from './sentiment/SentimentEditDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const [localFeedbackData, setLocalFeedbackData] = useState<Feedback[]>(feedbackData);
  const [sentimentDialogOpen, setSentimentDialogOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [currentPageIds, setCurrentPageIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // Update local state when props change
  useEffect(() => {
    setLocalFeedbackData(feedbackData);
    // Update current page IDs
    setCurrentPageIds(new Set(feedbackData.map(item => item.id)));
  }, [feedbackData]);

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'customer_feedback'
        },
        (payload) => {
          // Only update if the changed record is on the current page
          if (currentPageIds.has(payload.new.id)) {
            console.log('Updating record on current page:', payload.new.id);
            setLocalFeedbackData(prevData => 
              prevData.map(item => 
                item.id === payload.new.id 
                  ? { 
                      ...item, 
                      sentiment: payload.new.sentiment,
                      sentiment_score: payload.new.sentiment_score 
                    }
                  : item
              )
            );

            // Show toast notification for update
            toast({
              title: "Update Received",
              description: "A feedback entry has been updated.",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentPageIds, toast]);

  const handleOpenSentimentDialog = (feedback: Feedback) => {
    console.log('Opening sentiment dialog for feedback:', feedback);
    // Ensure we're setting the selected feedback first and then opening the dialog
    setSelectedFeedback(feedback);
    setSentimentDialogOpen(true);
  };

  const handleSaveSentiment = async (feedbackId: string, sentiment: string) => {
    try {
      // Optimistic update
      setLocalFeedbackData(prevData =>
        prevData.map(item =>
          item.id === feedbackId
            ? { ...item, sentiment }
            : item
        )
      );

      const { error } = await supabase
        .from('customer_feedback')
        .update({ sentiment })
        .eq('id', feedbackId);

      if (error) {
        console.error('Error updating sentiment:', error);
        throw error;
      }
      
      toast({
        title: "Sentiment Updated",
        description: "The sentiment has been successfully updated.",
      });
    } catch (error) {
      console.error('Failed to update sentiment:', error);
      toast({
        title: "Update Failed",
        description: "There was a problem updating the sentiment.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="p-2 sm:p-4 md:p-6 overflow-x-auto">
        <FeedbackTable
          data={localFeedbackData}
          categories={categories}
          subcategories={subcategories}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          openTagDialog={openTagDialog}
          openSentimentDialog={handleOpenSentimentDialog}
          onPageChange={(pageData) => {
            // Update current page IDs when page changes
            setCurrentPageIds(new Set(pageData.map(item => item.id)));
          }}
        />
      </CardContent>

      {selectedFeedback && (
        <SentimentEditDialog
          open={sentimentDialogOpen}
          onOpenChange={setSentimentDialogOpen}
          feedback={selectedFeedback}
          onSave={handleSaveSentiment}
        />
      )}
    </Card>
  );
};
