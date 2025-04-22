
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FeedbackTable } from '@/components/dashboard/FeedbackTable';
import { Feedback } from '@/models/feedback';
import { SentimentEditDialog } from './sentiment/SentimentEditDialog';
import { supabase } from '@/integrations/supabase/client';

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
  const [sentimentDialogOpen, setSentimentDialogOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);

  const handleOpenSentimentDialog = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setSentimentDialogOpen(true);
  };

  const handleSaveSentiment = async (feedbackId: string, sentiment: string) => {
    const { error } = await supabase
      .from('customer_feedback')
      .update({ sentiment })
      .eq('id', feedbackId);

    if (error) throw error;
  };

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
          openSentimentDialog={handleOpenSentimentDialog}
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
