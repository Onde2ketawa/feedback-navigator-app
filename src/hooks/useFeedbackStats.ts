
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FeedbackFilter } from './useFeedbackData';

export type FeedbackStats = {
  totalFeedback: number;
  averageRating: number;
  uncategorizedCount: number;
  recentFeedbackCount: number;
  channelDistribution: { name: string; count: number }[];
  ratingDistribution: { rating: number; count: number }[];
};

export function useFeedbackStats(filter?: FeedbackFilter) {
  return useQuery({
    queryKey: ['feedback-stats', filter],
    queryFn: async (): Promise<FeedbackStats> => {
      // Build the base query with the same filters used in useFeedbackData
      let countQuery = supabase.from('customer_feedback').select('*', { count: 'exact', head: true });
      let baseQuery = supabase.from('customer_feedback').select('*');
      
      // Apply the same filters as useFeedbackData
      if (filter) {
        // Apply channel filter
        if (filter.channel && filter.channel !== 'all') {
          countQuery = countQuery.eq('channel_id', filter.channel);
          baseQuery = baseQuery.eq('channel_id', filter.channel);
        }
        
        // Apply year filter
        if (filter.year && filter.year !== 'all') {
          const startOfYear = `${filter.year}-01-01`;
          const endOfYear = `${parseInt(filter.year) + 1}-01-01`;
          countQuery = countQuery.gte('submit_date', startOfYear).lt('submit_date', endOfYear);
          baseQuery = baseQuery.gte('submit_date', startOfYear).lt('submit_date', endOfYear);
        }
        
        // Apply month filter if year is selected
        if (filter.year && filter.year !== 'all' && filter.month && filter.month !== 'all') {
          const month = parseInt(filter.month);
          const year = parseInt(filter.year);
          const startDate = new Date(year, month - 1, 1);
          const endDate = new Date(year, month, 0);
          const startDateStr = startDate.toISOString().split('T')[0];
          const endDateStr = endDate.toISOString().split('T')[0];
          
          countQuery = countQuery.gte('submit_date', startDateStr).lte('submit_date', endDateStr);
          baseQuery = baseQuery.gte('submit_date', startDateStr).lte('submit_date', endDateStr);
        }
        
        // Apply rating range filter
        countQuery = countQuery.gte('rating', filter.ratingMin).lte('rating', filter.ratingMax);
        baseQuery = baseQuery.gte('rating', filter.ratingMin).lte('rating', filter.ratingMax);
      }
      
      // Get total feedback count with filters applied
      const { count: totalFeedback, error: countError } = await countQuery;
      
      if (countError) throw countError;
      
      // Get all filtered data for calculations
      const { data: allData, error: dataError } = await baseQuery.select('id, rating, category, submit_date, channel_id');
      
      if (dataError) throw dataError;
      
      // Calculate average rating from filtered data
      const averageRating = allData.length > 0 
        ? allData.reduce((sum, item) => sum + item.rating, 0) / allData.length 
        : 0;
      
      // Get uncategorized count from filtered data
      const uncategorizedCount = allData.filter(item => !item.category).length;
      
      // Get recent feedback count (last 7 days) from filtered data
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const recentFeedbackCount = allData.filter(item => 
        new Date(item.submit_date) >= sevenDaysAgo
      ).length;
      
      // Get channel distribution from filtered data
      const feedbackIds = allData.map(item => item.id);
      
      let channelDistribution: { name: string; count: number }[] = [];
      
      if (feedbackIds.length > 0) {
        const { data: channelData, error: channelError } = await supabase
          .from('customer_feedback')
          .select(`
            channel:channel_id(name)
          `)
          .in('id', feedbackIds);
        
        if (channelError) throw channelError;
        
        const channelCounts: Record<string, number> = {};
        channelData.forEach(item => {
          const channelName = item.channel?.name || 'Unknown';
          channelCounts[channelName] = (channelCounts[channelName] || 0) + 1;
        });
        
        channelDistribution = Object.entries(channelCounts).map(([name, count]) => ({ name, count }));
      }
      
      // Get rating distribution from filtered data
      const ratingCounts: Record<number, number> = {};
      allData.forEach(item => {
        ratingCounts[item.rating] = (ratingCounts[item.rating] || 0) + 1;
      });
      
      const ratingDistribution = Object.entries(ratingCounts).map(([rating, count]) => ({ 
        rating: parseInt(rating), 
        count 
      }));
      
      return {
        totalFeedback: totalFeedback || 0,
        averageRating,
        uncategorizedCount,
        recentFeedbackCount,
        channelDistribution,
        ratingDistribution
      };
    }
  });
}
