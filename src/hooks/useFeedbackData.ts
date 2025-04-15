
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
      
      // First, build the base query
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
      if (filter.channel && filter.channel !== 'all') {
        try {
          // First, get the channel ID from the name
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
          } else {
            console.warn("No channel found with name:", filter.channel);
          }
        } catch (err) {
          console.error("Error in channel filter:", err);
        }
      }
      
      // Apply year filter if selected - Using simple date range comparisons
      if (filter.year && filter.year !== 'all') {
        console.log(`Filtering by year: ${filter.year}`);
        const startOfYear = `${filter.year}-01-01`;
        const endOfYear = `${parseInt(filter.year) + 1}-01-01`;
        
        query = query.filter('submit_date', 'not.is', null)
                     .gte('submit_date', startOfYear)
                     .lt('submit_date', endOfYear);
      }
      
      // Apply month filter if selected (and year is selected)
      if (filter.year && filter.year !== 'all' && filter.month && filter.month !== 'all') {
        console.log(`Filtering by year: ${filter.year} and month: ${filter.month}`);
        const month = parseInt(filter.month);
        const year = parseInt(filter.year);
        
        // Create date range for the specific month
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0); // Last day of the month
        
        // Format dates as ISO strings and take just the date part
        const startDateStr = startDate.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0] + " 23:59:59";
        
        console.log(`Date range: ${startDateStr} to ${endDateStr}`);
        
        // Update the query with month filtering
        query = query.gte('submit_date', startDateStr)
                     .lte('submit_date', endDateStr);
      }
      
      // Apply rating range filter
      query = query.gte('rating', filter.ratingMin)
                   .lte('rating', filter.ratingMax);
      
      // Apply ordering with proper syntax for Supabase
      query = query.order('submit_date', { ascending: false });
      
      // Execute the query and log the SQL for debugging
      const { data, error, count } = await query;
      
      if (error) {
        console.error("Error fetching feedback data:", error);
        throw error;
      }
      
      console.log("Fetched feedback data:", data ? data.length : 0, "items");
      // Log query parameters for debugging
      console.log("SQL query params:", { 
        channel: filter.channel, 
        year: filter.year, 
        month: filter.month, 
        rating: `${filter.ratingMin}-${filter.ratingMax}` 
      });

      // Check if we have any data
      if (!data || data.length === 0) {
        console.log("No feedback data found matching the filters");
      }
      
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
