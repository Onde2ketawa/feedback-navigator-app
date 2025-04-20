
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { SentimentTrendDataPoint } from '@/hooks/sentiment/types';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface SentimentTrendChartProps {
  data: SentimentTrendDataPoint[];
}

export const SentimentTrendChart: React.FC<SentimentTrendChartProps> = ({ data }) => {
  // Configuration for the chart's appearance
  const config = {
    positive: { color: '#10b981', label: 'Positive' },
    neutral: { color: '#facc15', label: 'Neutral' },
    negative: { color: '#f43f5e', label: 'Negative' },
  };

  if (data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-muted-foreground">
        No sentiment trend data available
      </div>
    );
  }

  return (
    <ChartContainer config={config} className="h-[400px] w-full">
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="positive" 
          stroke={config.positive.color} 
          strokeWidth={2}
          activeDot={{ r: 6 }} 
        />
        <Line 
          type="monotone" 
          dataKey="neutral" 
          stroke={config.neutral.color} 
          strokeWidth={2} 
        />
        <Line 
          type="monotone" 
          dataKey="negative" 
          stroke={config.negative.color} 
          strokeWidth={2} 
        />
      </LineChart>
    </ChartContainer>
  );
};
