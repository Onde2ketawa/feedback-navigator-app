
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useFeedbackStats } from '@/hooks/useFeedbackStats';
import { Loader2, AlertCircle, Star, BarChart4, PieChart } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

// Register the required chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export function DashboardStats() {
  const { data: stats, isLoading, error } = useFeedbackStats();
  
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
  
  // Prepare chart data for rating distribution
  const ratingLabels = [1, 2, 3, 4, 5];
  
  const ratingChartData = {
    labels: ratingLabels,
    datasets: [
      {
        label: 'Rating Distribution',
        data: ratingLabels.map(rating => {
          const found = stats.ratingDistribution.find(item => item.rating === rating);
          return found ? found.count : 0;
        }),
        backgroundColor: [
          '#f43f5e',
          '#f97316', 
          '#facc15',
          '#a3e635',
          '#10b981'
        ],
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
      
      {/* Average Rating */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
          <div className="flex items-center mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${
                  i < Math.round(stats.averageRating) 
                    ? 'fill-yellow-400 text-yellow-400' 
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
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
        <CardContent className="aspect-square flex items-center justify-center">
          <div className="w-full h-full max-h-40">
            <Doughnut 
              data={channelChartData} 
              options={{
                plugins: {
                  legend: { position: 'bottom', align: 'center' },
                }
              }}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Rating Distribution */}
      <Card className="col-span-1 md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Rating Distribution</CardTitle>
          <CardDescription>Distribution of ratings from 1-5</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <Bar 
              data={ratingChartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: { precision: 0 }
                  }
                },
                plugins: {
                  legend: { display: false }
                }
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
