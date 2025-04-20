
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DeviceCategoryData } from '@/hooks/device/useDeviceAnalyticsData';

interface DeviceCategoryComparisonProps {
  data: DeviceCategoryData[];
}

export function DeviceCategoryComparison({ data }: DeviceCategoryComparisonProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No category data available
      </div>
    );
  }

  // Transform data for stacked bar chart
  const transformedData = data.reduce((acc: any[], item) => {
    const existingDevice = acc.find(d => d.device === item.device);
    if (existingDevice) {
      existingDevice[item.category] = item.count;
    } else {
      acc.push({
        device: item.device,
        [item.category]: item.count
      });
    }
    return acc;
  }, []);

  // Get unique categories for bars
  const categories = Array.from(new Set(data.map(item => item.category)));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={transformedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="device" />
          <YAxis />
          <Tooltip />
          <Legend />
          {categories.map((category, index) => (
            <Bar
              key={category}
              dataKey={category}
              stackId="a"
              fill={`hsl(${index * (360 / categories.length)}, 70%, 50%)`}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
