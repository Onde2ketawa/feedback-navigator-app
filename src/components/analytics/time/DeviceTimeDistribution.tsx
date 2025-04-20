
import React, { useState } from 'react';
import { DeviceTimeData } from '@/hooks/time/useTimeAnalyticsData';
import { Card, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DeviceTimeDistributionProps {
  data: DeviceTimeData[];
}

// Array of colors for different devices
const DEVICE_COLORS = [
  '#14b8a6', // Teal
  '#6366f1', // Indigo
  '#f97316', // Orange
  '#8b5cf6', // Purple
  '#f43f5e', // Rose
  '#10b981', // Emerald
  '#ec4899', // Pink
  '#a3e635', // Lime
];

export const DeviceTimeDistribution: React.FC<DeviceTimeDistributionProps> = ({ data }) => {
  const [visibleDevices, setVisibleDevices] = useState<string[]>(
    data.slice(0, 5).map(item => item.device) // Show top 5 devices by default
  );
  
  if (!data || data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center border rounded-md bg-gray-50">
        <p className="text-gray-500">No device time distribution data available</p>
      </div>
    );
  }
  
  // Transform the data for the chart
  // We need to have each time period as an object with counts for each device
  const transformedData = (() => {
    const timeLabels = new Set<string>();
    
    // Collect all time labels
    data.forEach(deviceData => {
      deviceData.values.forEach(value => {
        timeLabels.add(value.timeLabel);
      });
    });
    
    // Create objects for each time label with counts for each device
    return Array.from(timeLabels).sort().map(timeLabel => {
      const timeObj: Record<string, any> = { timeLabel };
      
      data.forEach(deviceData => {
        const value = deviceData.values.find(v => v.timeLabel === timeLabel);
        timeObj[deviceData.device] = value ? value.count : 0;
      });
      
      return timeObj;
    });
  })();
  
  const toggleDevice = (device: string) => {
    if (visibleDevices.includes(device)) {
      setVisibleDevices(visibleDevices.filter(d => d !== device));
    } else {
      setVisibleDevices([...visibleDevices, device]);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {data.map((device, index) => (
          <button
            key={device.device}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              visibleDevices.includes(device.device)
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => toggleDevice(device.device)}
          >
            {device.device}
          </button>
        ))}
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={transformedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="timeLabel" 
              angle={-45} 
              textAnchor="end" 
              height={60}
            />
            <YAxis 
              label={{ value: 'Feedback Count', angle: -90, position: 'insideLeft' }} 
            />
            <Tooltip />
            <Legend />
            {data.map((device, index) => (
              visibleDevices.includes(device.device) && (
                <Line
                  key={device.device}
                  type="monotone"
                  dataKey={device.device}
                  name={device.device}
                  stroke={DEVICE_COLORS[index % DEVICE_COLORS.length]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              )
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
