
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DataTable } from '@/components/ui/data-table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FeedbackData {
  id: string;
  channel: { name: string };
  rating: number;
  submit_date: string;
  submit_time: string;
  feedback: string;
  category: string | null;
  sub_category: string | null;
  device: string;
  app_version: string;
  language: string;
  sentiment: string;
}

const FeedbackReview = () => {
  const [sortField, setSortField] = useState<keyof FeedbackData>('submit_date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { data: feedbackData, isLoading } = useQuery({
    queryKey: ['feedback-review', sortField, sortOrder],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customer_feedback')
        .select(`
          id,
          channel:channel_id(name),
          rating,
          submit_date,
          submit_time,
          feedback,
          category,
          sub_category,
          device,
          app_version,
          language,
          sentiment
        `)
        .order(sortField === 'channel' ? 'channel(name)' : sortField, { ascending: sortOrder === 'asc' });

      if (error) throw error;
      return data as FeedbackData[];
    },
  });

  const columns = [
    {
      accessorKey: 'channel.name',
      header: ({ column }: any) => (
        <Button
          variant="ghost"
          onClick={() => {
            setSortField('channel');
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
          }}
        >
          Channel
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'rating',
      header: ({ column }: any) => (
        <Button
          variant="ghost"
          onClick={() => {
            setSortField('rating');
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
          }}
        >
          Rating
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'feedback',
      header: ({ column }: any) => (
        <Button
          variant="ghost"
          onClick={() => {
            setSortField('feedback');
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
          }}
        >
          Feedback
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'device',
      header: ({ column }: any) => (
        <Button
          variant="ghost"
          onClick={() => {
            setSortField('device');
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
          }}
        >
          Device
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'app_version',
      header: ({ column }: any) => (
        <Button
          variant="ghost"
          onClick={() => {
            setSortField('app_version');
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
          }}
        >
          App Version
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'language',
      header: ({ column }: any) => (
        <Button
          variant="ghost"
          onClick={() => {
            setSortField('language');
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
          }}
        >
          Language
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'submit_date',
      header: ({ column }: any) => (
        <Button
          variant="ghost"
          onClick={() => {
            setSortField('submit_date');
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
          }}
        >
          Submit Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'submit_time',
      header: ({ column }: any) => (
        <Button
          variant="ghost"
          onClick={() => {
            setSortField('submit_time');
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
          }}
        >
          Submit Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'sentiment',
      header: ({ column }: any) => (
        <Button
          variant="ghost"
          onClick={() => {
            setSortField('sentiment');
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
          }}
        >
          Sentiment
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'category',
      header: ({ column }: any) => (
        <Button
          variant="ghost"
          onClick={() => {
            setSortField('category');
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
          }}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'sub_category',
      header: ({ column }: any) => (
        <Button
          variant="ghost"
          onClick={() => {
            setSortField('sub_category');
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
          }}
        >
          Sub Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Feedback Review</h1>
      <Card>
        <CardContent className="p-6">
          <DataTable columns={columns} data={feedbackData || []} />
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackReview;
