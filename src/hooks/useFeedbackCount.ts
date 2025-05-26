
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useFeedbackCount(year?: string) {
  return useQuery({
    queryKey: ['feedback-count', year],
    queryFn: async () => {
      let query = supabase
        .from('customer_feedback')
        .select('*', { count: 'exact', head: true });
      
      if (year && year !== 'all') {
        const startOfYear = `${year}-01-01`;
        const endOfYear = `${parseInt(year) + 1}-01-01`;
        query = query.gte('submit_date', startOfYear).lt('submit_date', endOfYear);
      }
      
      const { count, error } = await query;
      
      if (error) {
        console.error('Error fetching feedback count:', error);
        throw error;
      }
      
      return count || 0;
    }
  });
}
