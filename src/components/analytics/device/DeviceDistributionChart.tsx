
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { DeviceDistribution } from '@/hooks/device/useDeviceAnalyticsData';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Table, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="-ml-4"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Feedbacks
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
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
      sortingFn: "basic",
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
      <div className="min-h-[400px]">
        <ResponsiveContainer width="100%" height={400}>
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
