
import { SupabaseClient } from '@supabase/supabase-js';

export const buildTimeAnalyticsQuery = (
  supabase: SupabaseClient,
  channelFilter: string,
  yearFilter: string,
  monthFilter: string
) => {
  let query = supabase
    .from('customer_feedback')
    .select(`
      submit_date,
      submit_time,
      category,
      device,
      channel:channel_id(id, name)
    `);

  // Fix the channel filter - only apply if it's a valid UUID and not "all"
  if (channelFilter && channelFilter !== 'all') {
    // Check if the channelFilter is a UUID (simple validation)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(channelFilter)) {
      query = query.eq('channel_id', channelFilter);
    }
    // If not a UUID, we skip the filter to prevent the error
  }

  // Year filter logic
  if (yearFilter && yearFilter !== 'all') {
    const startOfYear = `${yearFilter}-01-01`;
    const endOfYear = `${parseInt(yearFilter) + 1}-01-01`;
    query = query.gte('submit_date', startOfYear)
                .lt('submit_date', endOfYear);
  }

  // Month filter logic (if year is also selected)
  if (yearFilter && yearFilter !== 'all' && monthFilter && monthFilter !== 'all') {
    const month = parseInt(monthFilter);
    const year = parseInt(yearFilter);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    
    query = query.gte('submit_date', startDateStr)
                .lte('submit_date', endDateStr);
  }

  return query;
};
