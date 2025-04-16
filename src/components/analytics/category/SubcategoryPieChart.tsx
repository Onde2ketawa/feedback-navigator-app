
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
    return (
      <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
        <p className="font-medium">{`${payload[0].name}: ${payload[0].value}`}</p>
        <p className="text-muted-foreground text-sm">{`${Math.round(payload[0].percent * 100)}%`}</p>
      </div>
    );
  }
  return null;
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

  return (
    <>
      <div className="mt-2">
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
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {selectedCategory ? (
            filteredSubcategoryData.length > 0 ? (
              <PieChart>
                <Pie
                  data={filteredSubcategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {filteredSubcategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
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
    </>
  );
};
