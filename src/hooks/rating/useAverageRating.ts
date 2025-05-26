
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAverageRating = (
  channelFilter: string, 
  yearFilter: string, 
  monthFilter: string
) => {
  const [averageRating, setAverageRating] = useState<number>(0);
  const [ratingCount, setRatingCount] = useState<number>(0);

  const fetchAverageRating = useCallback(async () => {
    // For MyHana channel, use the new database function
    if (channelFilter === 'myHana' || channelFilter === 'MyHana') {
      try {
        const { data, error } = await supabase.rpc('get_myhana_rating_stats');
        
        if (error) throw error;
        
        if (data && Array.isArray(data) && data.length > 0) {
          setAverageRating(data[0].avg_rating || 0);
          setRatingCount(data[0].rating_count || 0);
        } else {
          // Reset values if no data found
          setAverageRating(0);
          setRatingCount(0);
        }
      } catch (error) {
        console.error('Error fetching MyHana rating stats:', error);
        setAverageRating(0);
        setRatingCount(0);
      }
    } else {
      // Existing logic for other channels or 'all'
      try {
        const { data, error } = await supabase.rpc('get_average_rating', {
          channel_id_param: channelFilter === 'all' ? null : channelFilter
        });
        
        if (error) throw error;
        
        if (data && Array.isArray(data) && data.length > 0) {
          setAverageRating(data[0].average_rating || 0);
        } else {
          setAverageRating(0);
        }
      } catch (error) {
        console.error('Error fetching average rating:', error);
        setAverageRating(0);
      }
    }
  }, [channelFilter]);

  return {
    averageRating, 
    ratingCount,
    fetchAverageRating
  };
};
