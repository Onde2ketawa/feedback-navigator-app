import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { Feedback } from '@/models/feedback';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

interface SentimentEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feedback: Feedback;
  onSave: (feedbackId: string, sentiment: string) => Promise<void>;
}

export const SentimentEditDialog: React.FC<SentimentEditDialogProps> = ({
  open,
  onOpenChange,
  feedback,
  onSave,
}) => {
  const [selectedSentiment, setSelectedSentiment] = useState<string>(
    feedback.sentiment || 'Neutral'
  );
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Call the database function to update sentiment
      const { error } = await supabase.rpc('update_feedback_sentiment', {
        feedback_id: feedback.id,
        sentiment_value: selectedSentiment.toLowerCase()
      });

      if (error) throw error;

      await onSave(feedback.id, selectedSentiment);
      
      // Invalidate the feedback queries to trigger a refresh
      await queryClient.invalidateQueries({ queryKey: ['feedback'] });
      
      toast({
        title: "Success",
        description: "Sentiment updated successfully",
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save sentiment:', error);
      toast({
        title: "Error",
        description: "Failed to update sentiment",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Sentiment</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Feedback Text</Label>
            <div className="p-3 border rounded-md bg-muted/50">
              <p className="text-sm">{feedback.feedback}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Sentiment</Label>
            <Select
              value={selectedSentiment}
              onValueChange={setSelectedSentiment}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select sentiment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Positive">Positive</SelectItem>
                <SelectItem value="Negative">Negative</SelectItem>
                <SelectItem value="Neutral">Neutral</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
