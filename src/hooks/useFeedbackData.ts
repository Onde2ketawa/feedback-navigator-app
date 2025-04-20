import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Feedback } from '@/models/feedback';
import { useAuth } from '@/contexts/AuthContext';

export interface FeedbackFilter {
  channel: string | null;
  year: string | null;
  month: string | null;
  ratingMin: number;
  ratingMax: number;
}

export function useFeedbackData(filter: FeedbackFilter) {
  const { session } = useAuth();

  return useQuery({
    queryKey: ['feedback', filter, session?.user.id],
    queryFn: async () => {
      console.log("Applying filters:", filter);
      
      let query = supabase
        .from('customer_feedback')
        .select(`
          id,
          channel_id,
          rating,
          submit_date,
          submit_time,
          feedback,
          category,
          sub_category,
          device,
          app_version,
          language,
          sentiment,
          sentiment_score,
          channel:channel_id(id, name)
        `);
      
      // Apply channel filter directly with UUID
      if (filter.channel && filter.channel !== 'all') {
        console.log("Applying channel filter:", filter.channel);
        query = query.eq('channel_id', filter.channel);
      }
      
      // Apply year filter
      if (filter.year && filter.year !== 'all') {
        const startOfYear = `${filter.year}-01-01`;
        const endOfYear = `${parseInt(filter.year) + 1}-01-01`;
        query = query.gte('submit_date', startOfYear)
                    .lt('submit_date', endOfYear);
      }
      
      // Apply month filter if year is selected
      if (filter.year && filter.year !== 'all' && filter.month && filter.month !== 'all') {
        const month = parseInt(filter.month);
        const year = parseInt(filter.year);
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const startDateStr = startDate.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0];
        
        query = query.gte('submit_date', startDateStr)
                    .lte('submit_date', endDateStr);
      }
      
      // Apply rating range filter
      query = query.gte('rating', filter.ratingMin)
                  .lte('rating', filter.ratingMax)
                  .order('submit_date', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching feedback:", error);
        throw error;
      }
      
      console.log("Filtered data count:", data?.length);
      return data?.map(item => ({
        id: item.id,
        channel: item.channel?.name || '',
        rating: typeof item.rating === 'number' ? item.rating : parseInt(item.rating) || 1,
        submitDate: item.submit_date || new Date().toISOString().split('T')[0],
        submitTime: item.submit_time || '',
        feedback: item.feedback,
        category: item.category,
        subcategory: item.sub_category,
        device: item.device || '',
        appVersion: item.app_version || '',
        language: item.language || '',
        sentiment: item.sentiment,
        sentiment_score: item.sentiment_score
      })) as Feedback[];
    },
    retry: 1,
    enabled: !!session
  });
}
