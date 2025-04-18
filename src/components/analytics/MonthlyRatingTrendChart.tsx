
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MonthlyRatingDataPoint } from '@/hooks/rating/types';

interface MonthlyRatingTrendChartProps {
  data: MonthlyRatingDataPoint[];
}

export function MonthlyRatingTrendChart({ data }: MonthlyRatingTrendChartProps) {
  // Calculate average rating if we have data
  const avgRating = data.length > 0
    ? data.reduce((sum, item) => sum + item.rating, 0) / data.length
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Rating Trend</CardTitle>
        <CardDescription>
          Daily average ratings for selected month and channel
          {avgRating > 0 && ` (Average: ${avgRating.toFixed(1)})`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {data.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No data available for the selected filters. Try selecting a specific month and year.
            </div>
          ) : (
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
                <Tooltip 
                  formatter={(value) => [`${value}`, 'Avg Rating']}
                  labelFormatter={(label) => `Day ${label}`}
                />
                <Legend />
                {avgRating > 0 && (
                  <ReferenceLine 
                    y={avgRating} 
                    label="Average" 
                    stroke="#f43f5e" 
                    strokeDasharray="3 3" 
                  />
                )}
                <Line
                  type="monotone"
                  dataKey="rating"
                  name="Average Rating"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
