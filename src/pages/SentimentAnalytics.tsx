
import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { ChannelFilter } from '@/components/dashboard/filters/ChannelFilter';
import { useSentimentAnalyticsData } from '@/hooks/sentiment/useSentimentAnalyticsData';
import { useSentimentRecalculate } from '@/hooks/sentiment/useSentimentRecalculate';
import { useBertSentimentRecalculate } from '@/hooks/sentiment/useBertSentimentRecalculate';
import { SentimentRecalculationCard } from '@/components/analytics/sentiment/SentimentRecalculationCard';
import { SentimentChartsGrid } from '@/components/analytics/sentiment/SentimentChartsGrid';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const SentimentAnalytics: React.FC = () => {
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
  
  const { isProcessing: isDbProcessing, progress: dbProgress, stats: dbStats, recalculate, recalculateWithEdgeFunction } = useSentimentRecalculate();
  const { isProcessing: isBertProcessing, progress: bertProgress, stats: bertStats, lastError: bertLastError, recalculateWithBert } = useBertSentimentRecalculate();
  
  const [selectedMethod, setSelectedMethod] = useState<'database' | 'edge' | 'bert'>('database');
  
  const isProcessing =
    (selectedMethod === 'database' && isDbProcessing) ||
    (selectedMethod === 'edge' && isDbProcessing) || // Since recalculateWithEdgeFunction is now tied to db hook for progress, key reuse
    (selectedMethod === 'bert' && isBertProcessing);

  const progress =
    selectedMethod === 'database'
      ? dbProgress
      : selectedMethod === 'edge'
      ? dbProgress // Still reusing DB hook for edge method as per hook
      : bertProgress;

  const stats =
    selectedMethod === 'database'
      ? dbStats
      : selectedMethod === 'edge'
      ? dbStats // Still reusing DB hook for edge method as per hook
      : bertStats;

  const lastError =
    selectedMethod === 'bert' ? bertLastError : null;

  const handleRecalculate = () => {
    if (selectedMethod === 'database') {
      recalculate();
    } else if (selectedMethod === 'edge') {
      recalculateWithEdgeFunction();
    } else {
      recalculateWithBert();
    }
  };
  
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <PageHeader 
          title="Sentiment Analytics" 
          description="Analyze sentiment trends, distribution, and categories across feedback"
        />
        <div className="flex gap-2">
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
      <SentimentRecalculationCard
        selectedMethod={selectedMethod}
        setSelectedMethod={setSelectedMethod}
        onRecalculate={handleRecalculate}
        isProcessing={isProcessing}
        progress={progress}
        stats={stats}
        lastError={lastError}
      />
      <div className="mb-6">
        <ChannelFilter
          availableChannels={availableChannels}
          selectedChannel={channelFilter}
          onChannelChange={setChannelFilter}
          isLoading={isLoading}
        />
      </div>
      <SentimentChartsGrid
        isLoading={isLoading}
        channelFilter={channelFilter}
        sentimentTrendData={sentimentTrendData}
        sentimentDistributionData={sentimentDistributionData}
        sentimentCategoryData={sentimentCategoryData}
      />
    </div>
  );
};

export default SentimentAnalytics;
