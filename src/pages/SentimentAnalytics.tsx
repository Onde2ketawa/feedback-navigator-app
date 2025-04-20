
import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChannelFilter } from '@/components/dashboard/filters/ChannelFilter';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useSentimentAnalyticsData } from '@/hooks/sentiment/useSentimentAnalyticsData';
import { SentimentTrendChart } from '@/components/analytics/sentiment/SentimentTrendChart';
import { SentimentDistributionChart } from '@/components/analytics/sentiment/SentimentDistributionChart';
import { SentimentCategoryChart } from '@/components/analytics/sentiment/SentimentCategoryChart';

const SentimentAnalytics: React.FC = () => {
  const [isRecalculating, setIsRecalculating] = useState(false);
  const {
    isLoading,
    channelFilter,
    setChannelFilter,
    sentimentTrendData,
    sentimentDistributionData,
    sentimentCategoryData,
    refreshData,
    availableChannels
  } = useSentimentAnalyticsData();
  
  const handleRecalculate = async () => {
    setIsRecalculating(true);
    try {
      const { error } = await supabase.rpc('recalculate_sentiment_scores');
      if (error) throw error;
      
      toast.success('Sentiment scores have been recalculated');
      // Refresh the data to show updated scores
      await refreshData();
    } catch (error) {
      console.error('Error recalculating sentiment scores:', error);
      toast.error('Failed to recalculate sentiment scores');
    } finally {
      setIsRecalculating(false);
    }
  };
  
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center">
        <PageHeader 
          title="Sentiment Analytics" 
          description="Analyze sentiment trends, distribution, and categories across feedback"
        />
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={handleRecalculate}
            disabled={isRecalculating}
          >
            <RefreshCw className={`h-4 w-4 ${isRecalculating ? 'animate-spin' : ''}`} />
            Recalculate Sentiment
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={refreshData}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Channel filter */}
      <div className="mb-6">
        <ChannelFilter
          availableChannels={availableChannels}
          selectedChannel={channelFilter}
          onChannelChange={setChannelFilter}
          isLoading={isLoading}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Trend */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Sentiment Trend</CardTitle>
            <CardDescription>
              Sentiment trend over time for {channelFilter === 'all' ? 'all channels' : channelFilter}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-80 flex items-center justify-center">
                <Skeleton className="h-full w-full" />
              </div>
            ) : (
              <SentimentTrendChart data={sentimentTrendData} />
            )}
          </CardContent>
        </Card>
        
        {/* Sentiment Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Distribution</CardTitle>
            <CardDescription>
              Distribution of sentiment across feedback
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-80 flex items-center justify-center">
                <Skeleton className="h-80 w-80 rounded-full mx-auto" />
              </div>
            ) : (
              <SentimentDistributionChart data={sentimentDistributionData} />
            )}
          </CardContent>
        </Card>
        
        {/* Sentiment by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Category Sentiment</CardTitle>
            <CardDescription>
              Average sentiment score by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-80 flex items-center justify-center">
                <Skeleton className="h-full w-full" />
              </div>
            ) : (
              <SentimentCategoryChart data={sentimentCategoryData} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SentimentAnalytics;
