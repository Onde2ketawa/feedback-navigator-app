
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useFeedbackStats } from '@/hooks/useFeedbackStats';
import { Loader2, AlertCircle, PieChart } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { FeedbackFilter } from '@/hooks/useFeedbackData';

// Register the required chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface DashboardStatsProps {
  filter?: FeedbackFilter;
}

export function DashboardStats({ filter }: DashboardStatsProps) {
  const { data: stats, isLoading, error } = useFeedbackStats(filter);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2">Loading statistics...</span>
      </div>
    );
  }
  
  if (error || !stats) {
    return (
      <div className="p-4 text-center text-red-500">
        <AlertCircle className="h-6 w-6 mx-auto mb-2" />
        <p>Error loading statistics</p>
      </div>
    );
  }
  
  // Calculate categorized percentage
  const categorizedPercentage = stats.totalFeedback > 0 
    ? 100 - (stats.uncategorizedCount / stats.totalFeedback * 100)
    : 0;
    
  // Prepare chart data for channel distribution
  const channelChartData = {
    labels: stats.channelDistribution.map(item => item.name),
    datasets: [
      {
        data: stats.channelDistribution.map(item => item.count),
        backgroundColor: [
          '#8b5cf6',
          '#6366f1',
          '#ec4899',
          '#f43f5e',
          '#f97316',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Total Feedback */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalFeedback}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.recentFeedbackCount} in the last 7 days
          </p>
        </CardContent>
      </Card>
      
      {/* Categorization Progress */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Categorization Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Math.round(categorizedPercentage)}%</div>
          <Progress 
            className="h-2 mt-2"
            value={categorizedPercentage} 
          />
          <p className="text-xs text-muted-foreground mt-1">
            {stats.uncategorizedCount} items need categorization
          </p>
        </CardContent>
      </Card>
      
      {/* Feedback by Channel */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Feedback by Channel</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          {stats.channelDistribution.length > 0 ? (
            <div className="w-full aspect-square max-w-[200px]">
              <Doughnut 
                data={channelChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: { 
                      position: 'bottom',
                      display: true,
                      align: 'center',
                      labels: {
                        boxWidth: 12,
                        padding: 15,
                        usePointStyle: true,
                      }
                    },
                  }
                }}
              />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No data available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
