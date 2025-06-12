
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SentimentDataPoint } from '@/hooks/app-version/useAppVersionAnalyticsData';

interface AppVersionSentimentChartProps {
  data: SentimentDataPoint[];
  channelName: string;
}

export const AppVersionSentimentChart: React.FC<AppVersionSentimentChartProps> = ({ data, channelName }) => {
  // Transform data for the chart
  const chartData = data.reduce((acc: any[], item) => {
    const existingItem = acc.find(d => d.appVersion === item.appVersion);
    if (existingItem) {
      existingItem[item.sentiment] = item.count;
    } else {
      acc.push({
        appVersion: item.appVersion,
        [item.sentiment]: item.count
      });
    }
    return acc;
  }, []);

  // Define sentiment colors
  const sentimentColors = {
    positive: '#10b981',
    neutral: '#facc15',
    negative: '#f43f5e'
  };

  const sentiments = ['positive', 'neutral', 'negative'];

  if (data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center">
        <p className="text-muted-foreground">No sentiment data available for {channelName}</p>
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
          {sentiments.map((sentiment) => (
            <Bar 
              key={sentiment} 
              dataKey={sentiment} 
              fill={sentimentColors[sentiment as keyof typeof sentimentColors]}
              name={sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
