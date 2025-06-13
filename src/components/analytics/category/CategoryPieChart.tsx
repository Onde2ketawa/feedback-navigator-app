
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface CategoryDataItem {
  name: string;
  value: number;
  color: string;
}

interface CategoryPieChartProps {
  data: CategoryDataItem[];
  selectedCategory?: string;
  onCategorySelect?: (category: string) => void;
}

// Custom tooltip for the bar chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const total = payload[0].payload.total || 0;
    const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : '0.0';
    
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800 mb-1">{label}</p>
        <p className="text-blue-600 text-sm">
          <span className="font-medium">Count: </span>
          {data.value}
        </p>
        <p className="text-gray-600 text-sm">
          <span className="font-medium">Percentage: </span>
          {percentage}%
        </p>
      </div>
    );
  }
  return null;
};

export const CategoryPieChart: React.FC<CategoryPieChartProps> = ({
  data,
  selectedCategory,
  onCategorySelect,
}) => {
  // Calculate total for percentage display
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Add total to each data item for percentage calculation
  const enrichedData = data.map(item => ({
    ...item,
    total,
    percentage: total > 0 ? ((item.value / total) * 100).toFixed(1) : '0.0'
  }));

  // Sort data by value in descending order for better visualization
  const sortedData = enrichedData.sort((a, b) => b.value - a.value);

  const handleBarClick = (data: any) => {
    if (onCategorySelect) {
      onCategorySelect(data.name);
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center">
        <p className="text-muted-foreground">No category data available</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Main Chart */}
      <div className="h-96 w-full mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 140, bottom: 20 }}
            barSize={40}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={true} vertical={false} />
            <XAxis 
              type="number" 
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
              domain={[0, 'dataMax']}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              tick={{ fontSize: 12, fill: '#475569' }}
              axisLine={false}
              tickLine={false}
              width={130}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              onClick={handleBarClick}
              cursor="pointer"
              radius={[0, 6, 6, 0]}
            >
              {sortedData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke={entry.name === selectedCategory ? '#1e293b' : 'transparent'}
                  strokeWidth={entry.name === selectedCategory ? 2 : 0}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Clean Legend with percentages */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-700 text-sm mb-3">Category Breakdown</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sortedData.map((item, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                item.name === selectedCategory 
                  ? 'bg-blue-50 border-blue-200 shadow-sm' 
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
              }`}
              onClick={() => onCategorySelect && onCategorySelect(item.name)}
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div
                  className="w-4 h-4 rounded-sm flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium text-gray-700 truncate">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center space-x-3 flex-shrink-0">
                <span className="text-sm text-gray-500">
                  {item.value}
                </span>
                <span className="text-sm font-medium text-gray-700 bg-white px-2 py-1 rounded border">
                  {item.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
