
import React from 'react';
import { TimeDistributionData } from '@/hooks/time/useTimeAnalyticsData';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TimeDistributionChartProps {
  data: TimeDistributionData[];
  timeUnit: 'month' | 'day';
}

export const TimeDistributionChart: React.FC<TimeDistributionChartProps> = ({ data, timeUnit }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center border rounded-md bg-gray-50">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 20,
            bottom: 70,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="label" 
            angle={-45} 
            textAnchor="end" 
            height={70}
          />
          <YAxis 
            label={{ value: 'Feedback Count', angle: -90, position: 'insideLeft' }} 
          />
          <Tooltip 
            formatter={(value: number) => [`${value} feedbacks`, `${timeUnit === 'month' ? 'Month' : 'Day'}`]} 
          />
          <Bar 
            dataKey="count" 
            name="Feedback Count" 
            fill="#8b5cf6" 
            radius={[4, 4, 0, 0]} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
