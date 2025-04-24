
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { DeviceDistribution } from '@/hooks/device/useDeviceAnalyticsData';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Table } from 'lucide-react';

const COLORS = ['#8b5cf6', '#6366f1', '#ec4899', '#f43f5e', '#f97316', '#14b8a6'];

interface DeviceDistributionChartProps {
  data: DeviceDistribution[];
}

export function DeviceDistributionChart({ data }: DeviceDistributionChartProps) {
  const columns: ColumnDef<DeviceDistribution>[] = [
    {
      accessorKey: "device",
      header: "Device Version",
      cell: ({ row }) => {
        const colorIndex = row.index % COLORS.length;
        return (
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: COLORS[colorIndex] }}
            />
            <span className="font-medium">{row.getValue("device")}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "count",
      header: "Feedbacks",
      cell: ({ row }) => {
        const totalFeedbacks = data.reduce((sum, item) => sum + item.count, 0);
        const percentage = ((row.getValue("count") as number) / totalFeedbacks * 100).toFixed(1);
        return (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-medium">{row.getValue("count")}</span>
              <Badge variant="secondary" className="text-xs">
                {percentage}%
              </Badge>
            </div>
            <div className="w-24 bg-gray-100 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all"
                style={{ 
                  width: `${percentage}%`,
                  backgroundColor: COLORS[row.index % COLORS.length]
                }}
              />
            </div>
          </div>
        );
      },
    }
  ];

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
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row items-stretch justify-between gap-6 min-h-[400px]">
        <div className="w-full lg:w-3/5 h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius="90%"
                innerRadius="50%"
                paddingAngle={3}
                dataKey="count"
                nameKey="device"
                label={customLabel}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`${value} feedbacks`, 'Count']}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="w-full lg:w-2/5 flex items-center">
          <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3">
            {data.map((entry, index) => (
              <div 
                key={`legend-${index}`}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
              >
                <div 
                  className="w-4 h-4 rounded-md mt-1" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">{entry.device}</span>
                  <span className="text-xs text-gray-500">
                    {entry.count.toLocaleString()} feedbacks
                  </span>
                  <span className="text-xs text-gray-400">
                    {((entry.count / data.reduce((sum, item) => sum + item.count, 0)) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border rounded-lg">
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Table className="w-4 h-4" />
            <span>Device Distribution Details</span>
          </div>
        </div>
        <DataTable 
          columns={columns}
          data={data}
          pagination={true}
        />
      </div>
    </div>
  );
}
