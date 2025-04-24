import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import type { FeedbackData, SortField } from '@/hooks/useFeedbackReview';

interface CreateFeedbackColumnsProps {
  sortField: SortField;
  sortOrder: 'asc' | 'desc';
  onSort: (field: SortField) => void;
}

export function createFeedbackColumns({ 
  sortField, 
  sortOrder, 
  onSort 
}: CreateFeedbackColumnsProps): ColumnDef<FeedbackData>[] {
  return [
    {
      accessorKey: "channel.name",
      header: () => (
        <Button
          variant="ghost"
          onClick={() => onSort('channel')}
        >
          Channel
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'rating',
      header: () => (
        <Button
          variant="ghost"
          onClick={() => onSort('rating')}
        >
          Rating
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'feedback',
      header: () => (
        <Button
          variant="ghost"
          onClick={() => onSort('feedback')}
        >
          Feedback
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'device',
      header: () => (
        <Button
          variant="ghost"
          onClick={() => onSort('device')}
        >
          Device
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'app_version',
      header: () => (
        <Button
          variant="ghost"
          onClick={() => onSort('app_version')}
        >
          App Version
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'language',
      header: () => (
        <Button
          variant="ghost"
          onClick={() => onSort('language')}
        >
          Language
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'submit_date',
      header: () => (
        <Button
          variant="ghost"
          onClick={() => onSort('submit_date')}
        >
          Submit Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'submit_time',
      header: () => (
        <Button
          variant="ghost"
          onClick={() => onSort('submit_time')}
        >
          Submit Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'sentiment',
      header: () => (
        <Button
          variant="ghost"
          onClick={() => onSort('sentiment')}
        >
          Sentiment
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'category',
      header: () => (
        <Button
          variant="ghost"
          onClick={() => onSort('category')}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        return <span>{row.original.category_name}</span>;
      },
    },
    {
      accessorKey: 'sub_category',
      header: () => (
        <Button
          variant="ghost"
          onClick={() => onSort('sub_category')}
        >
          Sub Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        return <span>{row.original.subcategory_name}</span>;
      },
    },
  ];
}
