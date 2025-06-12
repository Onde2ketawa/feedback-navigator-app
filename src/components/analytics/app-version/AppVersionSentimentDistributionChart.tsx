
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { SentimentDataPoint } from '@/hooks/app-version/useAppVersionAnalyticsData';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface AppVersionSentimentDistributionChartProps {
  data: SentimentDataPoint[];
  channelName: string;
}

export const AppVersionSentimentDistributionChart: React.FC<AppVersionSentimentDistributionChartProps> = ({ 
  data, 
  channelName 
}) => {
  // Transform sentiment data into distribution format
  const processedData = React.useMemo(() => {
    const distribution: Record<string, number> = {
      positive: 0,
      neutral: 0,
      negative: 0
    };

    // Aggregate sentiment counts
    data.forEach(item => {
      const sentiment = item.sentiment.toLowerCase();
      if (distribution[sentiment] !== undefined) {
        distribution[sentiment] += item.count;
      }
    });

    // Colors for different sentiments
    const colors = {
      positive: '#10b981', // green
      neutral: '#facc15',  // yellow
      negative: '#f43f5e'  // red
    };

    // Transform to chart format
    return Object.entries(distribution).map(([sentiment, count]) => ({
      name: sentiment.charAt(0).toUpperCase() + sentiment.slice(1),
      value: count,
      color: colors[sentiment as keyof typeof colors]
    })).filter(item => item.value > 0); // Only include sentiments with data
  }, [data]);

  // Custom rendering for the pie chart labels
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name
  }: any) => {
    if (percent < 0.05) return null; // Don't show labels for slices < 5%
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#fff"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (processedData.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-muted-foreground">
        No sentiment distribution data available for {channelName}
      </div>
    );
  }

  // Config for the chart
  const config = processedData.reduce((acc, item) => {
    acc[item.name] = {
      color: item.color,
      label: item.name
    };
    return acc;
  }, {} as Record<string, { color: string; label: string }>);

  return (
    <ChartContainer config={config} className="h-[300px] w-full">
      <PieChart>
        <Pie
          data={processedData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
        >
          {processedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend />
      </PieChart>
    </ChartContainer>
  );
};
