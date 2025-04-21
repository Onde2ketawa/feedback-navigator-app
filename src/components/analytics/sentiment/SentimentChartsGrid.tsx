
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SentimentTrendChart } from "./SentimentTrendChart";
import { SentimentDistributionChart } from "./SentimentDistributionChart";
import { SentimentCategoryChart } from "./SentimentCategoryChart";
import { Skeleton } from "@/components/ui/skeleton";

interface SentimentChartsGridProps {
  isLoading: boolean;
  channelFilter: string;
  sentimentTrendData: any;
  sentimentDistributionData: any;
  sentimentCategoryData: any;
}

export const SentimentChartsGrid: React.FC<SentimentChartsGridProps> = ({
  isLoading,
  channelFilter,
  sentimentTrendData,
  sentimentDistributionData,
  sentimentCategoryData
}) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* Sentiment Trend */}
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Sentiment Trend</CardTitle>
        <CardDescription>
          Sentiment trend over time for {channelFilter === "all" ? "all channels" : channelFilter}
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
);
