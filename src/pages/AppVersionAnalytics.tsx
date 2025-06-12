
import React from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppVersionAnalyticsData } from '@/hooks/app-version/useAppVersionAnalyticsData';
import { AppVersionDistributionChart } from '@/components/analytics/app-version/AppVersionDistributionChart';
import { AppVersionCategoryChart } from '@/components/analytics/app-version/AppVersionCategoryChart';
import { AppVersionSentimentChart } from '@/components/analytics/app-version/AppVersionSentimentChart';
import { Skeleton } from '@/components/ui/skeleton';

const AppVersionAnalytics: React.FC = () => {
  const {
    isLoading,
    channelData,
    appVersionData,
    categoryData,
    sentimentData
  } = useAppVersionAnalyticsData();

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="App Version Analytics" 
        description="Analyze feedback distribution, categories, and sentiment by app version across different channels"
      />

      <div className="space-y-8">
        {/* App Version Distribution by Channel */}
        <Card>
          <CardHeader>
            <CardTitle>App Version Distribution by Channel</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-80 flex items-center justify-center">
                <Skeleton className="h-4/5 w-full" />
              </div>
            ) : (
              <AppVersionDistributionChart data={appVersionData} />
            )}
          </CardContent>
        </Card>

        {/* Category Analysis by App Version and Channel */}
        <div className="grid grid-cols-1 gap-6">
          {channelData.map((channel) => (
            <Card key={channel.name}>
              <CardHeader>
                <CardTitle>Category Distribution by App Version - {channel.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-80 flex items-center justify-center">
                    <Skeleton className="h-4/5 w-full" />
                  </div>
                ) : (
                  <AppVersionCategoryChart 
                    data={categoryData.filter(item => item.channel === channel.name)} 
                    channelName={channel.name}
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sentiment Analysis by App Version and Channel */}
        <div className="grid grid-cols-1 gap-6">
          {channelData.map((channel) => (
            <Card key={`sentiment-${channel.name}`}>
              <CardHeader>
                <CardTitle>Sentiment Distribution by App Version - {channel.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-80 flex items-center justify-center">
                    <Skeleton className="h-4/5 w-full" />
                  </div>
                ) : (
                  <AppVersionSentimentChart 
                    data={sentimentData.filter(item => item.channel === channel.name)} 
                    channelName={channel.name}
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppVersionAnalytics;
