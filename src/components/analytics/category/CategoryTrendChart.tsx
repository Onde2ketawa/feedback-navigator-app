
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface CategoryTrendData {
  month: string;
  [key: string]: string | number; // Dynamic category names as keys
}

interface CategoryTrendChartProps {
  data: CategoryTrendData[];
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  availableCategories: string[];
}

// Colors for different categories
const CATEGORY_COLORS = [
  '#8b5cf6', '#6366f1', '#ec4899', '#f43f5e', 
  '#f97316', '#14b8a6', '#10b981', '#a3e635',
  '#84cc16', '#eab308', '#f59e0b', '#ef4444'
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            <span className="font-medium">{entry.dataKey}: </span>
            {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const CategoryTrendChart: React.FC<CategoryTrendChartProps> = ({
  data,
  selectedCategories,
  onCategoryToggle,
  availableCategories,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center">
        <p className="text-muted-foreground">No trend data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Category Selection */}
      <div className="flex flex-wrap gap-2">
        {availableCategories.map((category, index) => {
          const isSelected = selectedCategories.includes(category);
          const colorIndex = index % CATEGORY_COLORS.length;
          
          return (
            <button
              key={category}
              onClick={() => onCategoryToggle(category)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                isSelected
                  ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                  : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
              }`}
              style={isSelected ? { 
                backgroundColor: CATEGORY_COLORS[colorIndex] + '20',
                borderColor: CATEGORY_COLORS[colorIndex],
                color: CATEGORY_COLORS[colorIndex]
              } : {}}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Trend Chart */}
      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top" 
              height={36}
              iconType="line"
              wrapperStyle={{ paddingBottom: '20px', fontSize: '12px' }}
            />
            {selectedCategories.map((category, index) => {
              const colorIndex = availableCategories.indexOf(category) % CATEGORY_COLORS.length;
              return (
                <Line
                  key={category}
                  type="monotone"
                  dataKey={category}
                  stroke={CATEGORY_COLORS[colorIndex]}
                  strokeWidth={2}
                  dot={{ r: 4, fill: CATEGORY_COLORS[colorIndex] }}
                  activeDot={{ r: 6, fill: CATEGORY_COLORS[colorIndex] }}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary */}
      {selectedCategories.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          Showing trends for {selectedCategories.length} selected {selectedCategories.length === 1 ? 'category' : 'categories'}
        </div>
      )}
    </div>
  );
};
