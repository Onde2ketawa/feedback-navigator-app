
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type FeedbackStats = {
  totalFeedback: number;
  averageRating: number;
  uncategorizedCount: number;
  recentFeedbackCount: number;
  channelDistribution: { name: string; count: number }[];
  ratingDistribution: { rating: number; count: number }[];
};

export function useFeedbackStats() {
  return useQuery({
    queryKey: ['feedback-stats'],
    queryFn: async (): Promise<FeedbackStats> => {
      // Get total feedback count
      const { count: totalFeedback, error: countError } = await supabase
        .from('customer_feedback')
        .select('*', { count: 'exact', head: true });
      
      if (countError) throw countError;
      
      // Get average rating
      const { data: avgData, error: avgError } = await supabase
        .from('customer_feedback')
        .select('rating');
      
      if (avgError) throw avgError;
      
      const averageRating = avgData.length > 0 
        ? avgData.reduce((sum, item) => sum + item.rating, 0) / avgData.length 
        : 0;
      
      // Get uncategorized count
      const { count: uncategorizedCount, error: uncatError } = await supabase
        .from('customer_feedback')
        .select('*', { count: 'exact', head: true })
        .is('category', null);
      
      if (uncatError) throw uncatError;
      
      // Get recent feedback count (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { count: recentFeedbackCount, error: recentError } = await supabase
        .from('customer_feedback')
        .select('*', { count: 'exact', head: true })
        .gte('submit_date', sevenDaysAgo.toISOString());
      
      if (recentError) throw recentError;
      
      // Get channel distribution
      const { data: channelData, error: channelError } = await supabase
        .from('customer_feedback')
        .select(`
          channel:channel_id(name)
        `);
      
      if (channelError) throw channelError;
      
      const channelCounts: Record<string, number> = {};
      channelData.forEach(item => {
        const channelName = item.channel?.name || 'Unknown';
        channelCounts[channelName] = (channelCounts[channelName] || 0) + 1;
      });
      
      const channelDistribution = Object.entries(channelCounts).map(([name, count]) => ({ name, count }));
      
      // Get rating distribution
      const { data: ratingData, error: ratingError } = await supabase
        .from('customer_feedback')
        .select('rating');
      
      if (ratingError) throw ratingError;
      
      const ratingCounts: Record<number, number> = {};
      ratingData.forEach(item => {
        ratingCounts[item.rating] = (ratingCounts[item.rating] || 0) + 1;
      });
      
      const ratingDistribution = Object.entries(ratingCounts).map(([rating, count]) => ({ 
        rating: parseInt(rating), 
        count 
      }));
      
      return {
        totalFeedback: totalFeedback || 0,
        averageRating,
        uncategorizedCount: uncategorizedCount || 0,
        recentFeedbackCount: recentFeedbackCount || 0,
        channelDistribution,
        ratingDistribution
      };
    }
  });
}
