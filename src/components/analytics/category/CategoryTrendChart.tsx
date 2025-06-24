
import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList,
} from 'recharts';
import { BarChart3, TrendingUp } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

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

type ChartType = 'line' | 'bar';

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

// Custom label component for showing values on data points
const CustomLabel = (props: any) => {
  const { x, y, value } = props;
  if (value === 0) return null;
  
  return (
    <text
      x={x}
      y={y - 10}
      fill="#666"
      textAnchor="middle"
      fontSize="10"
      fontWeight="500"
    >
      {value}
    </text>
  );
};

// Custom label component for bar values
const CustomBarLabel = (props: any) => {
  const { x, y, width, height, value } = props;
  
  if (value === 0) return null;
  
  return (
    <text
      x={x + width / 2}
      y={y - 5}
      fill="#666"
      textAnchor="middle"
      fontSize="10"
      fontWeight="500"
    >
      {value}
    </text>
  );
};

export const CategoryTrendChart: React.FC<CategoryTrendChartProps> = ({
  data,
  selectedCategories,
  onCategoryToggle,
  availableCategories,
}) => {
  const [chartType, setChartType] = React.useState<ChartType>('line');

  if (!data || data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center">
        <p className="text-muted-foreground">No trend data available</p>
      </div>
    );
  }

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 30, right: 30, left: 20, bottom: 20 }
    };

    if (chartType === 'bar') {
      return (
        <BarChart {...commonProps}>
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
            iconType="rect"
            wrapperStyle={{ paddingBottom: '20px', fontSize: '12px' }}
          />
          {selectedCategories.map((category, index) => {
            const colorIndex = availableCategories.indexOf(category) % CATEGORY_COLORS.length;
            return (
              <Bar
                key={category}
                dataKey={category}
                fill={CATEGORY_COLORS[colorIndex]}
                name={category}
              >
                <LabelList content={<CustomBarLabel />} />
              </Bar>
            );
          })}
        </BarChart>
      );
    }

    return (
      <LineChart {...commonProps}>
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
            >
              <LabelList content={<CustomLabel />} />
            </Line>
          );
        })}
      </LineChart>
    );
  };

  return (
    <div className="space-y-4">
      {/* Chart Type Selector and Category Selection */}
      <div className="flex flex-wrap items-center justify-between gap-4">
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

        {/* Chart Type Toggle */}
        <ToggleGroup
          type="single"
          value={chartType}
          onValueChange={(value) => value && setChartType(value as ChartType)}
          className="border rounded-lg"
        >
          <ToggleGroupItem value="line" aria-label="Line Chart" className="px-3 py-2">
            <TrendingUp className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="bar" aria-label="Bar Chart" className="px-3 py-2">
            <BarChart3 className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Trend Chart */}
      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {/* Summary */}
      {selectedCategories.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          Showing trends for {selectedCategories.length} selected {selectedCategories.length === 1 ? 'category' : 'categories'} as {chartType} chart
        </div>
      )}
    </div>
  );
};
