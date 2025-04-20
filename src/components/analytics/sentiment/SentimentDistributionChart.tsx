
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { SentimentDistributionDataPoint } from '@/hooks/sentiment/types';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface SentimentDistributionChartProps {
  data: SentimentDistributionDataPoint[];
}

export const SentimentDistributionChart: React.FC<SentimentDistributionChartProps> = ({ data }) => {
  // Custom rendering for the pie chart labels
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    name
  }: any) => {
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

  if (data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-muted-foreground">
        No sentiment distribution data available
      </div>
    );
  }

  // Config for the chart
  const config = data.reduce((acc, item) => {
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
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend />
      </PieChart>
    </ChartContainer>
  );
};
