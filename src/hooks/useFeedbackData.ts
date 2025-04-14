
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Feedback } from '@/models/feedback';

export interface FeedbackFilter {
  channel: string | null;
  year: string | null;
  month: string | null;
  ratingMin: number;
  ratingMax: number;
}

export function useFeedbackData(filter: FeedbackFilter) {
  return useQuery({
    queryKey: ['feedback', filter],
    queryFn: async () => {
      console.log("Applying filters:", filter);
      let query = supabase
        .from('customer_feedback')
        .select(`
          id,
          channel:channel_id(name),
          rating,
          submit_date,
          feedback,
          category,
          sub_category,
          sentiment,
          sentiment_score
        `);
      
      if (filter.channel) {
        query = query.eq('channel_id.name', filter.channel);
      }
      
      if (filter.year) {
        query = query.gte('submit_date', `${filter.year}-01-01`)
                     .lt('submit_date', `${parseInt(filter.year) + 1}-01-01`);
      }
      
      if (filter.month) {
        query = query.gte('submit_date', `${filter.year}-${filter.month.padStart(2, '0')}-01`)
                     .lt('submit_date', `${filter.year}-${(parseInt(filter.month) + 1).toString().padStart(2, '0')}-01`);
      }
      
      query = query.gte('rating', filter.ratingMin)
                   .lte('rating', filter.ratingMax);
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data.map(item => ({
        id: item.id,
        channel: item.channel?.name || '',
        rating: item.rating,
        submitDate: item.submit_date || new Date().toISOString().split('T')[0],
        feedback: item.feedback,
        category: item.category,
        subcategory: item.sub_category,
        sentiment: item.sentiment,
        sentiment_score: item.sentiment_score
      })) as Feedback[];
    }
  });
}
