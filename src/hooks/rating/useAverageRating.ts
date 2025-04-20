
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAverageRating = (
  channelFilter: string,
  yearFilter: string,
  monthFilter: string
) => {
  const [averageRating, setAverageRating] = useState<number>(0);

  const fetchAverageRating = async () => {
    try {
      let query = supabase
        .from('customer_feedback')
        .select('rating');

      // Apply channel filter if not 'all'
      if (channelFilter !== 'all') {
        try {
          const { data: channelData } = await supabase
            .from('channel')
            .select('id')
            .eq('name', channelFilter)
            .single();
          
          if (channelData) {
            query = query.eq('channel_id', channelData.id);
          }
        } catch (err) {
          query = query.eq('channel_id', channelFilter);
        }
      }

      // Add year filter if not 'all'
      if (yearFilter !== 'all') {
        const yearStart = `${yearFilter}-01-01`;
        const yearEnd = `${yearFilter}-12-31`;
        query = query.gte('submit_date', yearStart).lte('submit_date', yearEnd);
      }

      // Add month filter if not 'all'
      if (monthFilter !== 'all' && yearFilter !== 'all') {
        const monthNum = parseInt(monthFilter);
        const monthStr = monthNum < 10 ? `0${monthNum}` : `${monthNum}`;
        const monthStart = `${yearFilter}-${monthStr}-01`;
        const lastDay = new Date(parseInt(yearFilter), monthNum, 0).getDate();
        const monthEnd = `${yearFilter}-${monthStr}-${lastDay}`;
        query = query.gte('submit_date', monthStart).lte('submit_date', monthEnd);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (!data || data.length === 0) {
        setAverageRating(0);
        return;
      }

      const sum = data.reduce((acc, curr) => acc + curr.rating, 0);
      const average = sum / data.length;
      setAverageRating(Number(average.toFixed(1)));

    } catch (error) {
      console.error('Error fetching average rating:', error);
      setAverageRating(0);
    }
  };

  return {
    averageRating,
    setAverageRating,
    fetchAverageRating
  };
};
