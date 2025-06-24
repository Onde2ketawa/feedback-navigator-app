
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { YoyTrendDataPoint } from '@/hooks/rating/types';

interface YearOverYearTrendChartProps {
  data: YoyTrendDataPoint[];
  channelFilter: string;
  yearFilter: string;
}

// Custom label component for line values
const CustomLineLabel = (props: any) => {
  const { x, y, value } = props;
  if (value === 0) return null;
  
  return (
    <text
      x={x}
      y={y - 10}
      fill="#666"
      textAnchor="middle"
      fontSize="10"
      fontWeight="500"
    >
      {value.toFixed(1)}
    </text>
  );
};

export function YearOverYearTrendChart({
  data,
  channelFilter,
  yearFilter
}: YearOverYearTrendChartProps) {
  const currentYear = new Date().getFullYear().toString();
  const previousYear = (Number(currentYear) - 1).toString();
  
  // Ensure numeric comparison by converting to numbers
  const hasCurrentYearData = data.some(point => Number(point[currentYear]) > 0);
  const hasPreviousYearData = data.some(point => Number(point[previousYear]) > 0);

  // Get channel name for display
  const channelName = channelFilter === 'all' ? 'All Channels' : channelFilter;
  
  // Custom tooltip formatter for better display
  const tooltipFormatter = (value: number | string) => {
    if (value === 0) return ['No data', 'Average Rating'];
    return [value, 'Average Rating'];
  };
  
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Year-over-Year Rating Trend</CardTitle>
        <CardDescription>
          Average rating trends by month for {channelName}: {currentYear} vs {previousYear}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 25,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis
                stroke="#64748b"
                domain={[0, 5]}
                ticks={[1, 2, 3, 4, 5]}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip 
                formatter={tooltipFormatter} 
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Legend />
              {hasCurrentYearData && (
                <Line
                  type="monotone"
                  dataKey={currentYear}
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                  name={`${currentYear}`}
                  connectNulls={false}
                >
                  <LabelList content={<CustomLineLabel />} />
                </Line>
              )}
              {hasPreviousYearData && (
                <Line
                  type="monotone"
                  dataKey={previousYear}
                  stroke="#6366f1"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                  name={`${previousYear}`}
                  connectNulls={false}
                >
                  <LabelList content={<CustomLineLabel />} />
                </Line>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
