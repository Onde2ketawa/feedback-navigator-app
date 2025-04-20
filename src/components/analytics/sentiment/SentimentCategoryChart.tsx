
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { SentimentCategoryDataPoint } from '@/hooks/sentiment/types';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface SentimentCategoryChartProps {
  data: SentimentCategoryDataPoint[];
}

export const SentimentCategoryChart: React.FC<SentimentCategoryChartProps> = ({ data }) => {
  // Create config from the data
  const config = {
    sentiment_score: { color: '#8b5cf6', label: 'Sentiment Score' },
  };

  if (data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-muted-foreground">
        No category sentiment data available
      </div>
    );
  }

  // Sort data by sentiment score for better visualization
  const sortedData = [...data].sort((a, b) => b.sentiment_score - a.sentiment_score);

  return (
    <ChartContainer config={config} className="h-[400px] w-full">
      <BarChart
        data={sortedData}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          type="number" 
          domain={[-1, 1]} 
          tickFormatter={(value) => value.toFixed(1)} 
        />
        <YAxis 
          type="category" 
          dataKey="name" 
          width={70} 
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend />
        <Bar 
          dataKey="sentiment_score" 
          fill="#8b5cf6" 
          background={{ fill: '#eee' }}
          animationDuration={1000}
        />
      </BarChart>
    </ChartContainer>
  );
};
