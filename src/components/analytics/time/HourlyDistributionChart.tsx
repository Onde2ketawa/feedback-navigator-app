
import React from 'react';
import { TimeDistributionData } from '@/hooks/time/useTimeAnalyticsData';
import { Card, CardContent } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface HourlyDistributionChartProps {
  data: TimeDistributionData[];
}

export const HourlyDistributionChart: React.FC<HourlyDistributionChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center border rounded-md bg-gray-50">
        <p className="text-gray-500">No hourly data available</p>
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 20,
            bottom: 10,
          }}
        >
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="label" 
            tick={{ fontSize: 10 }}
            interval={1}
          />
          <YAxis 
            label={{ value: 'Feedback Count', angle: -90, position: 'insideLeft' }} 
          />
          <Tooltip 
            formatter={(value: number) => [`${value} feedbacks`, 'Hour']} 
          />
          <Area 
            type="monotone" 
            dataKey="count" 
            name="Feedback Count" 
            stroke="#8884d8" 
            fillOpacity={1} 
            fill="url(#colorCount)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
