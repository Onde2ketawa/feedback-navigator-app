
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AppVersionDataPoint {
  appVersion: string;
  channel: string;
  count: number;
}

export interface CategoryDataPoint {
  appVersion: string;
  channel: string;
  category: string;
  categoryName: string;
  count: number;
}

export interface SentimentDataPoint {
  appVersion: string;
  channel: string;
  sentiment: string;
  count: number;
}

export interface ChannelInfo {
  name: string;
  id: string;
}

export const useAppVersionAnalyticsData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [channelData, setChannelData] = useState<ChannelInfo[]>([]);
  const [appVersionData, setAppVersionData] = useState<AppVersionDataPoint[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryDataPoint[]>([]);
  const [sentimentData, setSentimentData] = useState<SentimentDataPoint[]>([]);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);
      
      console.log('Fetching app version analytics data...');
      
      // Fetch all channels first
      const { data: channels, error: channelsError } = await supabase
        .from('channel')
        .select('id, name');

      if (channelsError) throw channelsError;

      const channelInfo = channels || [];
      setChannelData(channelInfo);
      console.log('Channels:', channelInfo);

      // Fetch app version distribution by channel
      const { data: feedbackData, error: feedbackError } = await supabase
        .from('customer_feedback')
        .select(`
          app_version,
          channel_id,
          category,
          sentiment,
          channel!inner(name)
        `);

      if (feedbackError) throw feedbackError;

      console.log('Raw feedback data:', feedbackData);

      if (feedbackData) {
        // Process app version distribution
        const versionDistribution: Record<string, Record<string, number>> = {};
        
        feedbackData.forEach(item => {
          const channelName = item.channel?.name || 'Unknown';
          const appVersion = item.app_version || 'Unknown';
          
          if (!versionDistribution[channelName]) {
            versionDistribution[channelName] = {};
          }
          if (!versionDistribution[channelName][appVersion]) {
            versionDistribution[channelName][appVersion] = 0;
          }
          versionDistribution[channelName][appVersion]++;
        });

        const versionData: AppVersionDataPoint[] = [];
        Object.entries(versionDistribution).forEach(([channel, versions]) => {
          Object.entries(versions).forEach(([appVersion, count]) => {
            versionData.push({ channel, appVersion, count });
          });
        });
        setAppVersionData(versionData);

        // Process category data
        const categoryDistribution: Record<string, Record<string, Record<string, number>>> = {};
        const categoryNames: Record<string, string> = {};

        // First, get category names
        const categoryIds = [...new Set(feedbackData.map(item => item.category).filter(Boolean))];
        if (categoryIds.length > 0) {
          const { data: categoriesData } = await supabase
            .from('categories')
            .select('id, name')
            .in('id', categoryIds);
          
          if (categoriesData) {
            categoriesData.forEach(cat => {
              categoryNames[cat.id] = cat.name;
            });
          }
        }

        feedbackData.forEach(item => {
          if (!item.category) return;
          
          const channelName = item.channel?.name || 'Unknown';
          const appVersion = item.app_version || 'Unknown';
          const categoryId = item.category;
          const categoryName = categoryNames[categoryId] || categoryId;
          
          if (!categoryDistribution[channelName]) {
            categoryDistribution[channelName] = {};
          }
          if (!categoryDistribution[channelName][appVersion]) {
            categoryDistribution[channelName][appVersion] = {};
          }
          if (!categoryDistribution[channelName][appVersion][categoryId]) {
            categoryDistribution[channelName][appVersion][categoryId] = 0;
          }
          categoryDistribution[channelName][appVersion][categoryId]++;
        });

        const categoryData: CategoryDataPoint[] = [];
        Object.entries(categoryDistribution).forEach(([channel, versions]) => {
          Object.entries(versions).forEach(([appVersion, categories]) => {
            Object.entries(categories).forEach(([category, count]) => {
              categoryData.push({
                channel,
                appVersion,
                category,
                categoryName: categoryNames[category] || category,
                count
              });
            });
          });
        });
        setCategoryData(categoryData);

        // Process sentiment data
        const sentimentDistribution: Record<string, Record<string, Record<string, number>>> = {};
        
        feedbackData.forEach(item => {
          const channelName = item.channel?.name || 'Unknown';
          const appVersion = item.app_version || 'Unknown';
          const sentiment = item.sentiment || 'neutral';
          
          if (!sentimentDistribution[channelName]) {
            sentimentDistribution[channelName] = {};
          }
          if (!sentimentDistribution[channelName][appVersion]) {
            sentimentDistribution[channelName][appVersion] = {};
          }
          if (!sentimentDistribution[channelName][appVersion][sentiment]) {
            sentimentDistribution[channelName][appVersion][sentiment] = 0;
          }
          sentimentDistribution[channelName][appVersion][sentiment]++;
        });

        const sentimentData: SentimentDataPoint[] = [];
        Object.entries(sentimentDistribution).forEach(([channel, versions]) => {
          Object.entries(versions).forEach(([appVersion, sentiments]) => {
            Object.entries(sentiments).forEach(([sentiment, count]) => {
              sentimentData.push({ channel, appVersion, sentiment, count });
            });
          });
        });
        
        console.log('Processed sentiment data:', sentimentData);
        setSentimentData(sentimentData);
      }
    } catch (error) {
      console.error('Error fetching app version analytics data:', error);
      toast.error('Failed to load app version analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    channelData,
    appVersionData,
    categoryData,
    sentimentData,
    refreshData: fetchAnalyticsData
  };
};
