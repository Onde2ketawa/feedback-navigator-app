
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DataTable } from '@/components/ui/data-table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { FilterContainer } from '@/components/dashboard/filters/FilterContainer';
import { ChannelFilter } from '@/components/dashboard/filters/ChannelFilter';
import { TimeFilter } from '@/components/dashboard/filters/TimeFilter';
import { RatingFilter } from '@/components/dashboard/filters/RatingFilter';

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
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [ratingRange, setRatingRange] = useState<[number, number]>([1, 5]);

  const { data: feedbackData, isLoading } = useQuery({
    queryKey: ['feedback-review', sortField, sortOrder, selectedChannel, selectedYear, selectedMonth, ratingRange],
    queryFn: async () => {
      let query = supabase
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
        `);

      // Apply filters
      if (selectedChannel !== 'all') {
        query = query.eq('channel_id', selectedChannel);
      }

      if (selectedYear !== 'all') {
        const startDate = `${selectedYear}-01-01`;
        const endDate = `${parseInt(selectedYear) + 1}-01-01`;
        query = query.gte('submit_date', startDate).lt('submit_date', endDate);
      }

      if (selectedMonth !== 'all' && selectedYear !== 'all') {
        const month = parseInt(selectedMonth);
        const year = parseInt(selectedYear);
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        query = query
          .gte('submit_date', startDate.toISOString().split('T')[0])
          .lte('submit_date', endDate.toISOString().split('T')[0]);
      }

      query = query
        .gte('rating', ratingRange[0])
        .lte('rating', ratingRange[1])
        .order(sortField === 'channel' ? 'channel(name)' : sortField, { ascending: sortOrder === 'asc' });

      const { data, error } = await query;

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
      
      <div className="space-y-6">
        <FilterContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ChannelFilter
              selectedChannel={selectedChannel}
              onChannelChange={setSelectedChannel}
            />
            <TimeFilter
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              onYearChange={setSelectedYear}
              onMonthChange={setSelectedMonth}
            />
            <RatingFilter
              ratingRange={ratingRange}
              onRatingRangeChange={setRatingRange}
            />
          </div>
        </FilterContainer>

        <Card>
          <CardContent className="p-6">
            <DataTable columns={columns} data={feedbackData || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FeedbackReview;
