
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface RatingDistributionChartProps {
  data: Array<{
    rating: string;
    count: number;
    color: string;
  }>;
}

export function RatingDistributionChart({ data }: RatingDistributionChartProps) {
  // Validate data to ensure we have valid counts
  const validData = data.map(item => ({
    ...item,
    count: typeof item.count === 'number' && !isNaN(item.count) ? item.count : 0
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rating Distribution</CardTitle>
        <CardDescription>
          Distribution of ratings by count
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {validData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No rating data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={validData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="rating" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="count" name="Feedback Count">
                  {validData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
