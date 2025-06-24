
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface SentimentTrendBarChartProps {
  chartData: any[];
  years: string[];
  config: {
    positive: { color: string; label: string };
    neutral: { color: string; label: string };
    negative: { color: string; label: string };
  }
}

// Custom label component for bar values
const CustomBarLabel = (props: any) => {
  const { x, y, width, height, value } = props;
  
  if (value === 0) return null;
  
  return (
    <text
      x={x + width / 2}
      y={y - 5}
      fill="#666"
      textAnchor="middle"
      fontSize="10"
      fontWeight="500"
    >
      {value}
    </text>
  );
};

export const SentimentTrendBarChart: React.FC<SentimentTrendBarChartProps> = ({
  chartData,
  years,
  config
}) => (
  <ChartContainer config={config} className="h-[400px] w-full">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend />
        {years.length > 0 ? years.map(year => (
          <React.Fragment key={year}>
            <Bar
              dataKey={`${year}_positive`}
              fill="#10b981"
              name={`${year} Positive`}
            >
              <LabelList content={<CustomBarLabel />} />
            </Bar>
            <Bar
              dataKey={`${year}_neutral`}
              fill="#facc15"
              name={`${year} Neutral`}
            >
              <LabelList content={<CustomBarLabel />} />
            </Bar>
            <Bar
              dataKey={`${year}_negative`}
              fill="#f43f5e"
              name={`${year} Negative`}
            >
              <LabelList content={<CustomBarLabel />} />
            </Bar>
          </React.Fragment>
        )) : (
          <Bar
            dataKey="positive"
            fill="#10b981"
            name="No data"
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  </ChartContainer>
);
