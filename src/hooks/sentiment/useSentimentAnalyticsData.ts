
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ChannelOption } from '@/hooks/useFilterOptions';
import { useSentimentTrendData } from './useSentimentTrendData';
import { useSentimentDistributionData } from './useSentimentDistributionData';
import { useSentimentCategoryData } from './useSentimentCategoryData';
import { fetchChannels } from '@/api/filters/channelApi';

export * from './types';

export function useSentimentAnalyticsData() {
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [availableChannels, setAvailableChannels] = useState<ChannelOption[]>([
    { value: 'all', label: 'All Channels' }
  ]);
  
  const { 
    sentimentTrendData, 
    setSentimentTrendData, 
    fetchSentimentTrendData 
  } = useSentimentTrendData();
  
  const { 
    sentimentDistributionData, 
    setSentimentDistributionData, 
    fetchSentimentDistributionData 
  } = useSentimentDistributionData();
  
  const { 
    sentimentCategoryData, 
    setSentimentCategoryData, 
    fetchSentimentCategoryData 
  } = useSentimentCategoryData();

  // Fetch channels
  useEffect(() => {
    const loadChannels = async () => {
      try {
        const channels = await fetchChannels();
        setAvailableChannels(channels);
      } catch (error) {
        console.error('Error fetching channels:', error);
      }
    };
    
    loadChannels();
  }, []);

  // Fetch all data when channelFilter changes
  useEffect(() => {
    console.log('[SentimentAnalytics] Channel filter changed to:', channelFilter);
    fetchSentimentAnalyticsData();
  }, [channelFilter]);

  const fetchSentimentAnalyticsData = async () => {
    setIsLoading(true);
    try {
      console.log('[SentimentAnalytics] Starting data fetch for channel:', channelFilter);
      
      const [trendData, distributionData, categoryData] = await Promise.all([
        fetchSentimentTrendData(channelFilter, '2025', 'all'),
        fetchSentimentDistributionData(channelFilter, '2025', 'all'),
        fetchSentimentCategoryData(channelFilter, '2025', 'all')
      ]);

      console.log('[SentimentAnalytics] Trend data result:', trendData?.length || 0, 'items');
      console.log('[SentimentAnalytics] Distribution data result:', distributionData?.length || 0, 'items');
      console.log('[SentimentAnalytics] Category data result:', categoryData?.length || 0, 'items');

      setSentimentTrendData(trendData);
      setSentimentDistributionData(distributionData);
      setSentimentCategoryData(categoryData);
      
    } catch (error) {
      console.error('Error fetching sentiment analytics data:', error);
      toast.error('Failed to load sentiment analytics data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    channelFilter,
    setChannelFilter,
    isLoading,
    sentimentTrendData,
    sentimentDistributionData,
    sentimentCategoryData,
    refreshData: fetchSentimentAnalyticsData,
    availableChannels
  };
}
