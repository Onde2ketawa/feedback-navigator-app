
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface FeedbackData {
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

export type SortField = keyof FeedbackData;

export function useFeedbackReview() {
  const [sortField, setSortField] = useState<SortField>('submit_date');
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

  return {
    feedbackData,
    isLoading,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    selectedChannel,
    setSelectedChannel,
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    ratingRange,
    setRatingRange,
  };
}
