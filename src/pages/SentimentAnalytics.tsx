
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
import { useToast } from '@/hooks/use-toast';

const SentimentAnalytics: React.FC = () => {
  const { toast } = useToast();
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
  
  const { 
    isProcessing: isDbProcessing, 
    progress: dbProgress, 
    stats: dbStats, 
    lastMessage: dbLastMessage,
    recalculate, 
    recalculateWithEdgeFunction 
  } = useSentimentRecalculate();
  
  const { 
    isProcessing: isBertProcessing, 
    progress: bertProgress, 
    stats: bertStats, 
    lastError: bertLastError, 
    lastMessage: bertLastMessage,
    recalculateWithBert 
  } = useBertSentimentRecalculate();
  
  const [selectedMethod, setSelectedMethod] = useState<'database' | 'edge' | 'bert'>('database');
  
  const isProcessing =
    (selectedMethod === 'database' && isDbProcessing) ||
    (selectedMethod === 'edge' && isDbProcessing) || 
    (selectedMethod === 'bert' && isBertProcessing);

  const progress =
    selectedMethod === 'database'
      ? dbProgress
      : selectedMethod === 'edge'
      ? dbProgress 
      : bertProgress;

  const stats =
    selectedMethod === 'database'
      ? dbStats
      : selectedMethod === 'edge'
      ? dbStats 
      : bertStats;

  const lastError =
    selectedMethod === 'bert' ? (bertLastError ? bertLastError.message : null) : null;
    
  const lastMessage =
    selectedMethod === 'database' 
      ? dbLastMessage 
      : selectedMethod === 'edge'
      ? dbLastMessage
      : bertLastMessage;

  const [reanalyzeLoading, setReanalyzeLoading] = useState(false);

  const handleRecalculate = () => {
    if (selectedMethod === 'database') {
      recalculate();
    } else if (selectedMethod === 'edge') {
      recalculateWithEdgeFunction();
    } else {
      recalculateWithBert();
    }
  };

  const handleReanalyzeNeutral = async () => {
    setReanalyzeLoading(true);
    try {
      const res = await fetch(
        'https://pltjqahdsvlngfjyqoma.supabase.co/functions/v1/reanalyze-neutral-feedback-with-bert',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ batchSize: 500 }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast({
          title: `Reanalyze Complete`,
          description: `${data.message || "Operation done."}`,
          variant: data.failed > 0 ? "destructive" : "default",
        });
        refreshData();
      } else {
        toast({
          title: "Failed to reanalyze neutral feedback",
          description: data.error || "Unknown error.",
          variant: "destructive"
        });
      }
    } catch (e: any) {
      toast({
        title: "Failed to reanalyze neutral feedback",
        description: e.message || "Unknown error.",
        variant: "destructive"
      });
    } finally {
      setReanalyzeLoading(false);
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
          <Button
            variant="secondary"
            size="sm"
            className="flex items-center gap-1"
            onClick={handleReanalyzeNeutral}
            disabled={reanalyzeLoading}
          >
            <RefreshCw className={`h-4 w-4 ${reanalyzeLoading ? 'animate-spin' : ''}`} />
            {reanalyzeLoading ? "Reanalyzing..." : "Reanalyze Neutral Feedback (IndoBERT)"}
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
        lastMessage={lastMessage}
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
