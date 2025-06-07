
import React, { useState } from 'react';
import { DeviceTimeData } from '@/hooks/time/useTimeAnalyticsData';
import { Card, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

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

interface DeviceTableRow {
  device: string;
  totalFeedback: number;
  latestMonth: string;
  latestCount: number;
}

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
  
  // Transform data for table
  const tableData: DeviceTableRow[] = data.map(deviceData => {
    const totalFeedback = deviceData.values.reduce((sum, value) => sum + value.count, 0);
    const latestValue = deviceData.values[deviceData.values.length - 1];
    
    return {
      device: deviceData.device,
      totalFeedback,
      latestMonth: latestValue?.timeLabel || 'N/A',
      latestCount: latestValue?.count || 0
    };
  }).sort((a, b) => b.totalFeedback - a.totalFeedback); // Sort by total feedback descending

  // Table columns definition
  const columns: ColumnDef<DeviceTableRow>[] = [
    {
      accessorKey: "device",
      header: "Device Version",
      cell: ({ row }) => {
        const isVisible = visibleDevices.includes(row.getValue("device"));
        const colorIndex = data.findIndex(d => d.device === row.getValue("device")) % DEVICE_COLORS.length;
        
        return (
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: DEVICE_COLORS[colorIndex] }}
            />
            <span className="font-medium">{row.getValue("device")}</span>
            {isVisible && (
              <Badge variant="secondary" className="text-xs">
                Visible
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "totalFeedback",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="-ml-4"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Total Feedback
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="font-medium">
            {row.getValue("totalFeedback")}
          </div>
        );
      },
      sortingFn: "basic",
    },
    {
      accessorKey: "latestMonth",
      header: "Latest Month",
      cell: ({ row }) => {
        return (
          <div className="text-sm">
            {row.getValue("latestMonth")}
          </div>
        );
      },
    },
    {
      accessorKey: "latestCount",
      header: "Latest Count",
      cell: ({ row }) => {
        return (
          <div className="text-sm font-medium">
            {row.getValue("latestCount")}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Chart",
      cell: ({ row }) => {
        const device = row.getValue("device") as string;
        const isVisible = visibleDevices.includes(device);
        
        return (
          <Button
            variant={isVisible ? "default" : "outline"}
            size="sm"
            onClick={() => toggleDevice(device)}
          >
            {isVisible ? "Hide" : "Show"}
          </Button>
        );
      },
    },
  ];
  
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
    <div className="space-y-6">
      {/* Chart Section */}
      <div className="space-y-4">
        <h3 className="text-md font-medium">Device Feedback Trend Chart</h3>
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

      {/* Table Section */}
      <div className="space-y-4">
        <h3 className="text-md font-medium">Device Summary Table</h3>
        <div className="border rounded-lg">
          <DataTable 
            columns={columns}
            data={tableData}
            pagination={true}
          />
        </div>
      </div>
    </div>
  );
};
