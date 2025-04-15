
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
          channel_id,
          rating,
          submit_date,
          feedback,
          category,
          sub_category,
          sentiment,
          sentiment_score,
          channel:channel_id(id, name)
        `);
      
      // Apply channel filter if selected
      if (filter.channel) {
        // Filter by channel name
        const { data: channelData, error: channelError } = await supabase
          .from('channel')
          .select('id')
          .eq('name', filter.channel)
          .single();
        
        if (channelError) {
          console.error("Error finding channel:", channelError);
          throw channelError;
        }
        
        if (channelData) {
          console.log("Filtering by channel ID:", channelData.id);
          query = query.eq('channel_id', channelData.id);
        }
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
      
      // Apply ordering with proper syntax for Supabase
      query = query.order('submit_date', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching feedback data:", error);
        throw error;
      }
      
      console.log("Fetched feedback data:", data);
      // Remove the toSQL() call as it doesn't exist on the PostgrestFilterBuilder
      console.log("SQL query params:", { channel: filter.channel, year: filter.year, month: filter.month, rating: `${filter.ratingMin}-${filter.ratingMax}` });
      
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
