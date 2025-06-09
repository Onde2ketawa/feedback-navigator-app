import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FeedbackTable } from '@/components/dashboard/FeedbackTable';
import { Feedback } from '@/models/feedback';
import { SentimentEditDialog } from './sentiment/SentimentEditDialog';
import { MultipleCategoryDialog } from './MultipleCategoryDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FeedbackFilter } from '@/hooks/useFeedbackData';

interface FeedbackTableContainerProps {
  feedbackData: Feedback[];
  categories: { id: string; name: string }[];
  subcategories: { id: string; name: string }[];
  selectedRows: string[];
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
  openTagDialog: (feedback: Feedback) => void;
  filter?: FeedbackFilter;
}

export const FeedbackTableContainer: React.FC<FeedbackTableContainerProps> = ({
  feedbackData,
  categories,
  subcategories,
  selectedRows,
  setSelectedRows,
  openTagDialog,
  filter,
}) => {
  const [localFeedbackData, setLocalFeedbackData] = useState<Feedback[]>(feedbackData);
  const [sentimentDialogOpen, setSentimentDialogOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [multipleCategoryDialogOpen, setMultipleCategoryDialogOpen] = useState(false);
  const [selectedFeedbackForMultipleCategory, setSelectedFeedbackForMultipleCategory] = useState<Feedback | null>(null);
  const { toast } = useToast();

  // Update local state when props change
  useEffect(() => {
    setLocalFeedbackData(feedbackData);
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
          console.log('Received real-time update:', payload);
          setLocalFeedbackData(prevData => 
            prevData.map(item => 
              item.id === payload.new.id 
                ? { 
                    ...item, 
                    category: payload.new.category,
                    sub_category: payload.new.sub_category,
                    sentiment: payload.new.sentiment,
                    sentiment_score: payload.new.sentiment_score 
                  }
                : item
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleOpenSentimentDialog = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setSentimentDialogOpen(true);
  };

  const handleOpenMultipleCategoryDialog = (feedback: Feedback) => {
    setSelectedFeedbackForMultipleCategory(feedback);
    setMultipleCategoryDialogOpen(true);
  };

  const handleSaveSentiment = async (feedbackId: string, sentiment: string) => {
    try {
      // Use the RPC function instead of direct table update
      const { error } = await supabase.rpc('update_feedback_sentiment', {
        feedback_id: feedbackId,
        sentiment_value: sentiment.toLowerCase()
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Sentiment updated successfully",
      });

      setSentimentDialogOpen(false);
    } catch (error) {
      console.error('Error updating sentiment:', error);
      toast({
        title: "Error",
        description: "Failed to update sentiment",
        variant: "destructive",
      });
    }
  };

  const handleSaveMultipleCategories = async (feedbackId: string, selectedCategories: string[]) => {
    try {
      // For now, we'll just save the first selected category as the primary category
      // In a real implementation, you might want to create a separate table for multiple categories
      const primaryCategory = selectedCategories[0];
      
      const { error } = await supabase.rpc('update_feedback_categories', {
        feedback_id: feedbackId,
        category_value: primaryCategory || null,
        subcategory_value: null // Reset subcategory when setting multiple categories
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Selected ${selectedCategories.length} categories. Primary category saved.`,
      });

      setMultipleCategoryDialogOpen(false);
    } catch (error) {
      console.error('Error updating multiple categories:', error);
      toast({
        title: "Error",
        description: "Failed to update categories",
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
          openMultipleCategoryDialog={handleOpenMultipleCategoryDialog}
          filter={filter}
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

      {selectedFeedbackForMultipleCategory && (
        <MultipleCategoryDialog
          isOpen={multipleCategoryDialogOpen}
          onOpenChange={setMultipleCategoryDialogOpen}
          selectedFeedback={selectedFeedbackForMultipleCategory}
          categories={categories}
          subcategories={subcategories}
          onSave={handleSaveMultipleCategories}
        />
      )}
    </Card>
  );
};
