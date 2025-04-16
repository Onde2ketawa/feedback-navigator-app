
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MonthlyRatingDataPoint } from '@/hooks/rating/useRatingAnalyticsData';

interface MonthlyRatingTrendChartProps {
  data: MonthlyRatingDataPoint[];
}

export function MonthlyRatingTrendChart({ data }: MonthlyRatingTrendChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Rating Trend</CardTitle>
        <CardDescription>
          Daily average ratings for selected month and channel
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
              <XAxis
                dataKey="day"
                stroke="#64748b"
                label={{ value: 'Day of Month', position: 'insideBottom', offset: -5 }}
              />
              <YAxis
                stroke="#64748b"
                domain={[0, 5]}
                ticks={[1, 2, 3, 4, 5]}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="rating"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
