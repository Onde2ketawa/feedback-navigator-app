
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
import { Feedback } from '@/models/feedback';
import { Loader2 } from 'lucide-react';

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
    feedback.sentiment || 'neutral'
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(feedback.id, selectedSentiment);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save sentiment:', error);
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
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="negative">Negative</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
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
