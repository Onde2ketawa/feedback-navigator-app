
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Tag } from 'lucide-react';
import { Feedback } from '@/models/feedback';

interface FeedbackRowActionsProps {
  feedback: Feedback;
  openTagDialog: (feedback: Feedback) => void;
}

export const FeedbackRowActions: React.FC<FeedbackRowActionsProps> = ({
  feedback,
  openTagDialog
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={(e) => {
            e.stopPropagation();
            console.log('Edit tags clicked for feedback:', feedback.id);
            openTagDialog(feedback);
          }}
        >
          <Tag className="mr-2 h-4 w-4" />
          <span>Edit Tags</span>
        </DropdownMenuItem>
        {/* Add more dropdown actions as needed */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
