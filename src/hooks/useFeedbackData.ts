
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Feedback } from '@/models/feedback';

export interface FeedbackFilter {
  channel: string | null;
  year: string | null;
  month: string | null;
  category: string | null;
  subcategory: string | null;
  ratingMin: number;
  ratingMax: number;
}

export const useFeedbackData = (filter: FeedbackFilter) => {
  return useQuery({
    queryKey: ['feedback', filter],
    queryFn: async (): Promise<Feedback[]> => {
      console.log("Fetching feedback with filter:", filter);
      
      let query = supabase
        .from('customer_feedback')
        .select('*')
        .order('submit_date', { ascending: false });

      // Apply filters
      if (filter.channel) {
        query = query.eq('channel', filter.channel);
      }

      if (filter.year) {
        const startDate = `${filter.year}-01-01`;
        const endDate = `${filter.year}-12-31`;
        query = query.gte('submit_date', startDate).lte('submit_date', endDate);
      }

      if (filter.month && filter.year) {
        const startDate = `${filter.year}-${filter.month.padStart(2, '0')}-01`;
        const lastDay = new Date(parseInt(filter.year), parseInt(filter.month), 0).getDate();
        const endDate = `${filter.year}-${filter.month.padStart(2, '0')}-${lastDay.toString().padStart(2, '0')}`;
        query = query.gte('submit_date', startDate).lte('submit_date', endDate);
      }

      if (filter.category) {
        query = query.eq('category', filter.category);
      }

      if (filter.subcategory) {
        query = query.eq('sub_category', filter.subcategory);
      }

      if (filter.ratingMin !== undefined && filter.ratingMax !== undefined) {
        query = query.gte('rating', filter.ratingMin).lte('rating', filter.ratingMax);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching feedback:', error);
        throw error;
      }

      console.log("Fetched feedback data:", data?.length || 0, "records");

      return (data || []).map(item => ({
        id: item.id,
        channel: item.channel || '',
        rating: item.rating || 0,
        feedback: item.feedback || '',
        submitDate: item.submit_date || '',
        sentiment: item.sentiment || '',
        category: item.category || '',
        subcategory: item.sub_category || '',
        device: item.device || '',
        appVersion: item.app_version || '',
        language: item.language || '',
        submitTime: item.submit_time || ''
      }));
    },
    enabled: true,
  });
};
