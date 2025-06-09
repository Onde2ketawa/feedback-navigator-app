
import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ArrowUp, ArrowDown, MoreHorizontal } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Feedback } from '@/models/feedback';
import { CategoryDisplay } from './CategoryDisplay';
import { RatingStars } from './RatingStars';
import { SentimentBadge } from './SentimentBadge';
import { FeedbackRowActions } from './FeedbackRowActions';

interface CreateFeedbackColumnsProps {
  categories: { id: string; name: string }[];
  subcategories: { id: string; name: string }[];
  openTagDialog: (feedback: Feedback) => void;
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
  openSentimentDialog: (feedback: Feedback) => void;
  openMultipleCategoryDialog?: (feedback: Feedback) => void;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (field: string) => void;
}

export function createFeedbackColumns({
  categories,
  subcategories,
  openTagDialog,
  setSelectedRows,
  openSentimentDialog,
  openMultipleCategoryDialog,
  sortField,
  sortOrder,
  onSort
}: CreateFeedbackColumnsProps): ColumnDef<Feedback>[] {
  const getSortIcon = (field: string) => {
    if (sortField === field && onSort) {
      return sortOrder === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />;
    }
    return onSort ? <ArrowUpDown className="ml-2 h-4 w-4" /> : null;
  };

  const createSortableHeader = (label: string, field: string) => {
    if (!onSort) {
      return label;
    }
    
    return (
      <Button
        variant="ghost"
        onClick={() => onSort(field)}
        className="h-auto p-0 font-semibold"
      >
        {label}
        {getSortIcon(field)}
      </Button>
    );
  };

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "channel",
      header: () => createSortableHeader("Channel", "channel"),
      cell: ({ row }) => {
        const channel = row.getValue("channel") as string;
        return <div className="font-medium">{channel || 'Unknown'}</div>;
      },
    },
    {
      accessorKey: "rating",
      header: () => createSortableHeader("Rating", "rating"),
      cell: ({ row }) => {
        const rating = row.getValue("rating") as number;
        return <RatingStars rating={rating} />;
      },
    },
    {
      accessorKey: "feedback",
      header: () => createSortableHeader("Feedback", "feedback"),
      cell: ({ row }) => {
        const feedback = row.getValue("feedback") as string;
        return (
          <div className="whitespace-normal break-words max-w-md">
            {feedback}
          </div>
        );
      },
    },
    {
      accessorKey: "submitDate",
      header: () => createSortableHeader("Submit Date", "submitDate"),
      cell: ({ row }) => {
        const date = row.getValue("submitDate") as string;
        return <div className="whitespace-nowrap">{date}</div>;
      },
    },
    {
      accessorKey: "sentiment",
      header: () => createSortableHeader("Sentiment", "sentiment"),
      cell: ({ row }) => {
        const sentiment = row.getValue("sentiment") as string;
        return <SentimentBadge sentiment={sentiment} />;
      },
    },
    {
      accessorKey: "category",
      header: () => createSortableHeader("Category", "category"),
      cell: ({ row }) => {
        const feedback = row.original;
        return (
          <CategoryDisplay
            categoryId={feedback.category}
            subcategoryId={feedback.subcategory}
            categories={categories}
            subcategories={subcategories}
            onMultipleCategoryClick={openMultipleCategoryDialog ? () => openMultipleCategoryDialog(feedback) : undefined}
          />
        );
      },
    },
    {
      accessorKey: "subcategory",
      header: () => createSortableHeader("Sub Category", "subcategory"),
      cell: ({ row }) => {
        const feedback = row.original;
        const subcategory = feedback.subcategory 
          ? subcategories.find(sc => sc.id === feedback.subcategory)
          : undefined;
        return (
          <div className="text-sm">
            {subcategory ? subcategory.name : '-'}
          </div>
        );
      },
    },
    {
      accessorKey: "device",
      header: () => createSortableHeader("Device", "device"),
      cell: ({ row }) => {
        const device = row.getValue("device") as string;
        return <div className="text-sm">{device || '-'}</div>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const feedback = row.original;
        return (
          <FeedbackRowActions
            feedback={feedback}
            openTagDialog={openTagDialog}
            openSentimentDialog={openSentimentDialog}
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];
}
