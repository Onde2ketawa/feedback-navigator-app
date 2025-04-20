
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

  if (channelFilter && channelFilter !== 'all') {
    query = query.eq('channel_id', channelFilter);
  }

  if (yearFilter && yearFilter !== 'all') {
    const startOfYear = `${yearFilter}-01-01`;
    const endOfYear = `${parseInt(yearFilter) + 1}-01-01`;
    query = query.gte('submit_date', startOfYear)
                .lt('submit_date', endOfYear);
  }

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
