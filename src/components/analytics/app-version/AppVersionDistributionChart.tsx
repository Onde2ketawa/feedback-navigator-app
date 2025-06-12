
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AppVersionDataPoint } from '@/hooks/app-version/useAppVersionAnalyticsData';

interface AppVersionDistributionChartProps {
  data: AppVersionDataPoint[];
}

export const AppVersionDistributionChart: React.FC<AppVersionDistributionChartProps> = ({ data }) => {
  // Transform data for the chart
  const chartData = data.reduce((acc: any[], item) => {
    const existingItem = acc.find(d => d.appVersion === item.appVersion);
    if (existingItem) {
      existingItem[item.channel] = item.count;
    } else {
      acc.push({
        appVersion: item.appVersion,
        [item.channel]: item.count
      });
    }
    return acc;
  }, []);

  // Get unique channels for colors
  const channels = [...new Set(data.map(item => item.channel))];
  const colors = ['#8b5cf6', '#6366f1', '#ec4899', '#f43f5e', '#f97316', '#14b8a6', '#10b981', '#a3e635'];

  if (data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center">
        <p className="text-muted-foreground">No app version data available</p>
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
          {channels.map((channel, index) => (
            <Bar 
              key={channel} 
              dataKey={channel} 
              fill={colors[index % colors.length]}
              name={channel}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
