import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Feedback } from '@/models/feedback';
import { RatingStars } from './RatingStars';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CategoryDisplay } from './CategoryDisplay';
import { FeedbackRowActions } from './FeedbackRowActions';

interface CreateFeedbackColumnsProps {
  categories: { id: string; name: string }[];
  subcategories: { id: string; name: string }[];
  openTagDialog: (feedback: Feedback) => void;
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
  openSentimentDialog: (feedback: Feedback) => void;
}

export function createFeedbackColumns({
  categories,
  subcategories,
  openTagDialog,
  setSelectedRows,
  openSentimentDialog,
}: CreateFeedbackColumnsProps): ColumnDef<Feedback>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Input
          type="checkbox"
          className="h-4 w-4"
          checked={
            table.getFilteredRowModel().rows.length > 0 &&
            table.getIsAllRowsSelected()
          }
          onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
        />
      ),
      cell: ({ row }) => (
        <Input
          type="checkbox"
          className="h-4 w-4"
          checked={row.getIsSelected()}
          onChange={(e) => {
            row.toggleSelected(e.target.checked)
            
            const id = row.original.id;
            if (e.target.checked) {
              setSelectedRows(prev => [...prev, id]);
            } else {
              setSelectedRows(prev => prev.filter(rowId => rowId !== id));
            }
          }}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "channel",
      header: "Channel",
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => {
        const rating = Number(row.getValue("rating"));
        return <RatingStars rating={isNaN(rating) ? 1 : rating} />;
      },
    },
    {
      accessorKey: "submitDate",
      header: "Submit Date",
    },
    {
      accessorKey: "submitTime",
      header: "Submit Time",
      enableHiding: true,
    },
    {
      accessorKey: "feedback",
      header: "Feedback",
      cell: ({ row }) => {
        const feedback = row.getValue("feedback") as string;
        return feedback ? (
          <div className="whitespace-pre-wrap break-words">
            {feedback}
          </div>
        ) : (
          <span className="text-muted-foreground italic">No feedback</span>
        );
      },
    },
    {
      accessorKey: "device",
      header: "Device",
      enableHiding: true,
    },
    {
      accessorKey: "appVersion",
      header: "App Version",
      enableHiding: true,
    },
    {
      accessorKey: "language",
      header: "Language",
      enableHiding: true,
    },
    {
      accessorKey: "sentiment",
      header: "Sentiment",
      cell: ({ row }) => {
        const feedback = row.original;
        const sentiment = feedback.sentiment || 'Neutral';
        
        return (
          <div className="flex items-center gap-2">
            <Badge 
              variant={
                sentiment === 'Positive' ? 'success' : 
                sentiment === 'Negative' ? 'destructive' : 'secondary'
              }
            >
              {sentiment}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                console.log('Sentiment edit button clicked for feedback:', feedback.id);
                openSentimentDialog(feedback);
              }}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
              type="button"
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit sentiment</span>
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: "sentiment_score",
      header: "Score",
      cell: ({ row }) => {
        const score = row.original.sentiment_score;
        return <span>{score?.toFixed(2) || 'N/A'}</span>;
      },
      enableHiding: true,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const categoryId = row.getValue("category") as string | undefined;
        const subcategoryId = row.original.subcategory;
        
        return (
          <CategoryDisplay
            categoryId={categoryId}
            subcategoryId={subcategoryId}
            categories={categories}
            subcategories={subcategories}
          />
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return <FeedbackRowActions feedback={row.original} openTagDialog={openTagDialog} />;
      },
    },
  ];
}
