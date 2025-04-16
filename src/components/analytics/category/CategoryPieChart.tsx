
import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
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

// Custom tooltip for the pie chart
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
        <p className="font-medium">{`${payload[0].name}: ${payload[0].value}`}</p>
        <p className="text-muted-foreground text-sm">{`${Math.round(payload[0].percent * 100)}%`}</p>
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
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            onClick={onCategorySelect ? (data) => onCategorySelect(data.name) : undefined}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color} 
                stroke={entry.name === selectedCategory ? '#000' : undefined}
                strokeWidth={entry.name === selectedCategory ? 2 : 0}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
