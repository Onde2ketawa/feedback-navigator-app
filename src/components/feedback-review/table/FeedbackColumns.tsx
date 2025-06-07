
import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
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
  const getSortIcon = (field: SortField) => {
    if (sortField === field) {
      return sortOrder === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />;
    }
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  };

  return [
    {
      accessorKey: "channel.name",
      header: () => (
        <Button
          variant="ghost"
          onClick={() => onSort('channel')}
        >
          Channel
          {getSortIcon('channel')}
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
          {getSortIcon('rating')}
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
          {getSortIcon('feedback')}
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
          {getSortIcon('device')}
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
          {getSortIcon('app_version')}
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
          {getSortIcon('language')}
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
          {getSortIcon('submit_date')}
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
          {getSortIcon('submit_time')}
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
          {getSortIcon('sentiment')}
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
          {getSortIcon('category')}
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
          {getSortIcon('sub_category')}
        </Button>
      ),
      cell: ({ row }) => {
        return <span>{row.original.subcategory_name}</span>;
      },
    },
  ];
}
