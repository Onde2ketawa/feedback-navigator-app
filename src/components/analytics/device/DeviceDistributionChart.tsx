
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { DeviceDistribution } from '@/hooks/device/useDeviceAnalyticsData';

const COLORS = ['#8b5cf6', '#6366f1', '#ec4899', '#f43f5e', '#f97316', '#14b8a6'];

interface DeviceDistributionChartProps {
  data: DeviceDistribution[];
}

export function DeviceDistributionChart({ data }: DeviceDistributionChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No device data available
      </div>
    );
  }

  const customLabel = ({ name, percent }: { name: string; percent: number }) => {
    return percent > 0.05 ? `${name} (${(percent * 100).toFixed(0)}%)` : '';
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 min-h-[400px]">
      <div className="w-full md:w-2/3 h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius="90%"
              innerRadius="40%"
              paddingAngle={2}
              dataKey="count"
              nameKey="device"
              label={customLabel}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  className="hover:opacity-80 transition-opacity"
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [`${value} feedbacks`, 'Count']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="w-full md:w-1/3">
        <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
          {data.map((entry, index) => (
            <div 
              key={`legend-${index}`}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50"
            >
              <div 
                className="w-4 h-4 rounded-sm" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{entry.device}</span>
                <span className="text-xs text-gray-500">
                  {entry.count} feedbacks ({((entry.count / data.reduce((sum, item) => sum + item.count, 0)) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

