
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CategoryDataPoint } from '@/hooks/app-version/useAppVersionAnalyticsData';

interface AppVersionCategoryChartProps {
  data: CategoryDataPoint[];
  channelName: string;
}

export const AppVersionCategoryChart: React.FC<AppVersionCategoryChartProps> = ({ data, channelName }) => {
  // Transform data for the chart
  const chartData = data.reduce((acc: any[], item) => {
    const existingItem = acc.find(d => d.appVersion === item.appVersion);
    if (existingItem) {
      existingItem[item.categoryName] = item.count;
    } else {
      acc.push({
        appVersion: item.appVersion,
        [item.categoryName]: item.count
      });
    }
    return acc;
  }, []);

  // Get unique categories for colors
  const categories = [...new Set(data.map(item => item.categoryName))];
  const colors = ['#8b5cf6', '#6366f1', '#ec4899', '#f43f5e', '#f97316', '#14b8a6', '#10b981', '#a3e635'];

  if (data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center">
        <p className="text-muted-foreground">No category data available for {channelName}</p>
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="appVersion" 
            angle={-45}
            textAnchor="end"
            height={100}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          {categories.map((category, index) => (
            <Bar 
              key={category} 
              dataKey={category} 
              fill={colors[index % colors.length]}
              name={category}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
