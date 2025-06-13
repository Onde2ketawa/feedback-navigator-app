
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
        <p className="font-semibold text-gray-800">{label}</p>
        <p className="text-blue-600">
          <span className="font-medium">Count: </span>
          {data.value}
        </p>
        <p className="text-gray-600">
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

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sortedData}
          layout="horizontal"
          margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            type="number" 
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={70}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="value" 
            fill={(entry: any) => entry.color}
            onClick={handleBarClick}
            cursor="pointer"
            radius={[0, 4, 4, 0]}
          >
            {sortedData.map((entry, index) => (
              <Bar
                key={`bar-${index}`}
                fill={entry.color}
                stroke={entry.name === selectedCategory ? '#000' : undefined}
                strokeWidth={entry.name === selectedCategory ? 2 : 0}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      {/* Legend with percentages */}
      <div className="mt-4 space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {sortedData.map((item, index) => (
            <div
              key={index}
              className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-colors ${
                item.name === selectedCategory 
                  ? 'bg-gray-100 border border-gray-300' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => onCategorySelect && onCategorySelect(item.name)}
            >
              <div
                className="w-3 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm font-medium text-gray-700 truncate flex-1">
                {item.name}
              </span>
              <span className="text-sm text-gray-500 flex-shrink-0">
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>
        <p className="text-center mt-4 text-sm text-muted-foreground">
          Click on a category to view its subcategories
        </p>
      </div>
    </div>
  );
};
