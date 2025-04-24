
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RatingTrendData } from '@/hooks/rating/types';

interface RatingTrendChartProps {
  data: RatingTrendData[];
  years: string[];
  channelFilter: string;
}

export const RatingTrendChart = ({ data, years, channelFilter }: RatingTrendChartProps) => {
  console.log('RatingTrendChart data:', data);
  
  // Color palette for consistent channel colors
  const colorPalette = [
    '#3b82f6', // MyHana Blue
    '#10b981', // LINE Bank Green
  ];

  // Format tooltip values
  const formatTooltipValue = (value: number) => {
    return value === 0 ? 'No data' : value.toFixed(2);
  };
  
  // Calculate averages for description display
  const getAverages = () => {
    if (data.length === 0) return { myHana: 0, lineBank: 0 };
    
    let myHanaSum = 0, myHanaCount = 0;
    let lineBankSum = 0, lineBankCount = 0;
    
    data.forEach(item => {
      if (item.myHana > 0) {
        myHanaSum += item.myHana;
        myHanaCount++;
      }
      if (item.lineBank > 0) {
        lineBankSum += item.lineBank;
        lineBankCount++;
      }
    });
    
    return {
      myHana: myHanaCount > 0 ? Number((myHanaSum / myHanaCount).toFixed(2)) : 0,
      lineBank: lineBankCount > 0 ? Number((lineBankSum / lineBankCount).toFixed(2)) : 0
    };
  };
  
  const averages = getAverages();

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Annual Rating Comparison ({years.join('-')})</CardTitle>
        <CardDescription>
          {channelFilter !== 'all' ? 
            `Showing data for ${channelFilter} channel` : 
            `Comparing MyHana (avg: ${averages.myHana}) and LINE Bank (avg: ${averages.lineBank}) annual ratings`}
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
              dataKey="year" 
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
                formatTooltipValue(value),
                name === 'myHana' ? 'MyHana' : 'LINE Bank'
              ]}
              labelFormatter={(label) => `Year: ${label}`}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '10px' }}
              formatter={(value) => value === 'myHana' ? 'MyHana' : 'LINE Bank'}
            />
            <Line
              type="monotone"
              dataKey="myHana"
              name="myHana"
              stroke={colorPalette[0]}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              animationDuration={500}
              isAnimationActive={true}
            />
            <Line
              type="monotone"
              dataKey="lineBank"
              name="lineBank"
              stroke={colorPalette[1]}
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              animationDuration={500}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
