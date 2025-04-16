
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
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { YoyTrendDataPoint } from '@/hooks/rating/useRatingAnalyticsData';

interface YearOverYearTrendChartProps {
  data: YoyTrendDataPoint[];
  channelFilter: string;
  yearFilter: string;
}

export function YearOverYearTrendChart({
  data,
  channelFilter,
  yearFilter
}: YearOverYearTrendChartProps) {
  const currentYear = new Date().getFullYear().toString();
  const previousYear = (Number(currentYear) - 1).toString();
  
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Year-over-Year Rating Trend</CardTitle>
        <CardDescription>
          Average rating trends by month for {currentYear} vs {previousYear}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
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
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey={currentYear}
                stroke="#8b5cf6"
                strokeWidth={2}
                activeDot={{ r: 8 }}
                name={`${currentYear}`}
              />
              <Line
                type="monotone"
                dataKey={previousYear}
                stroke="#6366f1"
                strokeWidth={2}
                activeDot={{ r: 8 }}
                name={`${previousYear}`}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
