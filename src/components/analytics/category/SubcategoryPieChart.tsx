
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

interface SubcategoryDataItem {
  name: string;
  value: number;
  color: string;
}

interface SubcategoryData {
  [key: string]: SubcategoryDataItem[];
}

interface SubcategoryPieChartProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  availableCategories: string[];
  subcategoryData: SubcategoryData;
}

// Custom tooltip for the pie chart
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800 mb-1">{data.name}</p>
        <p className="text-blue-600 text-sm">
          <span className="font-medium">Count: </span>
          {data.value}
        </p>
        <p className="text-gray-600 text-sm">
          <span className="font-medium">Percentage: </span>
          {Math.round(data.percent * 100)}%
        </p>
      </div>
    );
  }
  return null;
};

// Custom label function that only shows percentage for larger slices
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  // Only show label if slice is larger than 8%
  if (percent < 0.08) return null;
  
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize="12"
      fontWeight="600"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export const SubcategoryPieChart: React.FC<SubcategoryPieChartProps> = ({
  selectedCategory,
  setSelectedCategory,
  availableCategories,
  subcategoryData,
}) => {
  const filteredSubcategoryData = selectedCategory && subcategoryData[selectedCategory] 
    ? subcategoryData[selectedCategory]
    : [];

  // Sort data by value for better visualization
  const sortedData = filteredSubcategoryData.sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-4">
      <div>
        <Select 
          value={selectedCategory} 
          onValueChange={setSelectedCategory}
        >
          <SelectTrigger className="bg-white w-full">
            <SelectValue placeholder="Select a category to view subcategories" />
          </SelectTrigger>
          <SelectContent className="bg-white z-50">
            {availableCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {selectedCategory ? (
            filteredSubcategoryData.length > 0 ? (
              <PieChart>
                <Pie
                  data={sortedData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                >
                  {sortedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  iconType="circle"
                  wrapperStyle={{
                    paddingTop: '20px',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">No subcategory data available for {selectedCategory}</p>
              </div>
            )
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">Select a category to view subcategory data</p>
            </div>
          )}
        </ResponsiveContainer>
      </div>

      {/* Clean data summary below the chart */}
      {selectedCategory && sortedData.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700 text-sm">Subcategory Breakdown</h4>
          <div className="grid grid-cols-1 gap-2">
            {sortedData.map((item, index) => {
              const total = sortedData.reduce((sum, d) => sum + d.value, 0);
              const percentage = ((item.value / total) * 100).toFixed(1);
              
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded border bg-gray-50"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
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
                    <span className="text-sm font-medium text-gray-700 bg-white px-2 py-1 rounded border min-w-[50px] text-center">
                      {percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
