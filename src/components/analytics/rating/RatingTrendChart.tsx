
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface RatingTrendData {
  month: string;
  [key: string]: string | number; // Dynamic year-channel keys
}

interface RatingTrendChartProps {
  data: RatingTrendData[];
  years: string[];
  channelFilter: string;
}

export const RatingTrendChart = ({ data, years, channelFilter }: RatingTrendChartProps) => {
  // Filter to only show 2024-2025
  const filteredYears = years.filter(year => ['2024', '2025'].includes(year));
  
  // Color palette for consistent year colors
  const colorPalette = [
    '#3b82f6', // MyHana Blue
    '#10b981', // LINE Bank Green
  ];

  // Generate unique keys for each year-channel combination
  const generateLineElements = () => {
    return filteredYears.flatMap((year, index) => [
      <Line
        key={`myHana-${year}`}
        type="monotone"
        dataKey={`myHana-${year}`}
        name={`MyHana ${year}`}
        stroke={colorPalette[index % colorPalette.length]}
        strokeWidth={2}
        dot={{ r: 4 }}
        activeDot={{ r: 6 }}
        animationDuration={500}
        isAnimationActive={true}
      />,
      <Line
        key={`lineBank-${year}`}
        type="monotone"
        dataKey={`lineBank-${year}`}
        name={`LINE Bank ${year}`}
        stroke={colorPalette[(index + 1) % colorPalette.length]}
        strokeWidth={2}
        strokeDasharray="5 5"
        dot={{ r: 4 }}
        activeDot={{ r: 6 }}
        animationDuration={500}
        isAnimationActive={true}
      />
    ]);
  };

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Year-over-Year Rating Comparison (2024-2025)</CardTitle>
        <CardDescription>
          {channelFilter !== 'all' ? 
            `Showing data for ${channelFilter} channel` : 
            'Comparing MyHana and LINE Bank ratings by month'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis 
              dataKey="month" 
              tick={{ fill: '#888' }}
              tickMargin={10}
            />
            <YAxis 
              domain={[0, 5]} 
              tick={{ fill: '#888' }}
              tickMargin={10}
              tickFormatter={(value) => value.toFixed(1)}
            />
            <Tooltip 
              formatter={(value: number, name: string) => [
                `${value.toFixed(2)}`, 
                value === 0 ? 'No data' : name
              ]}
              labelFormatter={(label) => `Month: ${label}`}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '10px' }}
            />
            {generateLineElements()}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
