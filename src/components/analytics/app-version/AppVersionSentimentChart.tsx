
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SentimentDataPoint } from '@/hooks/app-version/useAppVersionAnalyticsData';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface AppVersionSentimentChartProps {
  data: SentimentDataPoint[];
  channelName: string;
}

export const AppVersionSentimentChart: React.FC<AppVersionSentimentChartProps> = ({ data, channelName }) => {
  console.log('AppVersionSentimentChart data:', data);
  console.log('Channel name:', channelName);

  // Transform data for the chart
  const chartData = React.useMemo(() => {
    const groupedData = data.reduce((acc: any[], item) => {
      const existingItem = acc.find(d => d.appVersion === item.appVersion);
      if (existingItem) {
        existingItem[item.sentiment] = (existingItem[item.sentiment] || 0) + item.count;
      } else {
        const newItem = {
          appVersion: item.appVersion,
          positive: 0,
          neutral: 0,
          negative: 0
        };
        newItem[item.sentiment] = item.count;
        acc.push(newItem);
      }
      return acc;
    }, []);

    // Sort by app version
    return groupedData.sort((a, b) => {
      // Try to sort numerically if possible, otherwise alphabetically
      const aNum = parseFloat(a.appVersion);
      const bNum = parseFloat(b.appVersion);
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return aNum - bNum;
      }
      return a.appVersion.localeCompare(b.appVersion);
    });
  }, [data]);

  console.log('Transformed chart data:', chartData);

  // Define sentiment colors
  const sentimentColors = {
    positive: '#10b981',
    neutral: '#facc15',
    negative: '#f43f5e'
  };

  if (!data || data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center">
        <p className="text-muted-foreground">No sentiment data available for {channelName}</p>
      </div>
    );
  }

  // Config for the chart
  const config = {
    positive: {
      label: 'Positive',
      color: sentimentColors.positive
    },
    neutral: {
      label: 'Neutral',
      color: sentimentColors.neutral
    },
    negative: {
      label: 'Negative',
      color: sentimentColors.negative
    }
  };

  return (
    <ChartContainer config={config} className="h-[300px] w-full">
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="appVersion" 
          angle={-45}
          textAnchor="end"
          height={80}
          interval={0}
        />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend />
        <Bar 
          dataKey="positive" 
          fill={sentimentColors.positive}
          name="Positive"
        />
        <Bar 
          dataKey="neutral" 
          fill={sentimentColors.neutral}
          name="Neutral"
        />
        <Bar 
          dataKey="negative" 
          fill={sentimentColors.negative}
          name="Negative"
        />
      </BarChart>
    </ChartContainer>
  );
};
