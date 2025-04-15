
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
      
      // Apply channel filter if selected
      if (filter.channel) {
        query = query.eq('channel_id.name', filter.channel);
      }
      
      // Apply year filter if selected
      if (filter.year) {
        query = query.gte('submit_date', `${filter.year}-01-01`)
                     .lt('submit_date', `${parseInt(filter.year) + 1}-01-01`);
      }
      
      // Apply month filter if selected (and year is selected)
      if (filter.year && filter.month) {
        const monthValue = parseInt(filter.month);
        const nextMonth = monthValue === 12 ? 1 : monthValue + 1;
        const nextMonthYear = monthValue === 12 ? parseInt(filter.year) + 1 : parseInt(filter.year);
        
        query = query.gte('submit_date', `${filter.year}-${monthValue.toString().padStart(2, '0')}-01`)
                     .lt('submit_date', `${nextMonthYear}-${nextMonth.toString().padStart(2, '0')}-01`);
      }
      
      // Apply rating range filter
      query = query.gte('rating', filter.ratingMin)
                   .lte('rating', filter.ratingMax);
      
      // Fix: Apply ordering with proper syntax for Supabase
      // Instead of using channel_id.name which causes parsing issues,
      // order by channel_id first since we're fetching the related channel name anyway
      query = query.order('channel_id', { ascending: true })
                   .order('rating', { ascending: false })
                   .order('submit_date', { ascending: false });
      
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
