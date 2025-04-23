
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface SentimentTrendLineChartProps {
  chartData: any[];
  years: string[];
  config: {
    positive: { color: string; label: string };
    neutral: { color: string; label: string };
    negative: { color: string; label: string };
  }
}
export const SentimentTrendLineChart: React.FC<SentimentTrendLineChartProps> = ({
  chartData,
  years,
  config
}) => (
  <ChartContainer config={config} className="h-[400px] w-full">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend />
        {years.length > 0 ? years.map(year => (
          <React.Fragment key={year}>
            <Line
              type="monotone"
              dataKey={`${year}_positive`}
              stroke="#10b981"
              strokeWidth={2}
              name={`${year} Positive`}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey={`${year}_neutral`}
              stroke="#facc15"
              strokeWidth={2}
              name={`${year} Neutral`}
            />
            <Line
              type="monotone"
              dataKey={`${year}_negative`}
              stroke="#f43f5e"
              strokeWidth={2}
              name={`${year} Negative`}
            />
          </React.Fragment>
        )) : (
          <Line
            type="monotone"
            dataKey="positive"
            stroke="#10b981"
            name="No data"
            isAnimationActive={false}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  </ChartContainer>
);
