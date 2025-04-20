
import React, { useState } from 'react';
import { CategoryTimeData } from '@/hooks/time/useTimeAnalyticsData';
import { Card, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CategoryTimeDistributionProps {
  data: CategoryTimeData[];
}

// Array of colors for different categories
const CATEGORY_COLORS = [
  '#8b5cf6', // Purple
  '#6366f1', // Indigo
  '#ec4899', // Pink
  '#f43f5e', // Rose
  '#f97316', // Orange
  '#14b8a6', // Teal
  '#10b981', // Emerald
  '#a3e635', // Lime
];

export const CategoryTimeDistribution: React.FC<CategoryTimeDistributionProps> = ({ data }) => {
  const [visibleCategories, setVisibleCategories] = useState<string[]>(
    data.slice(0, 5).map(item => item.category) // Show top 5 categories by default
  );
  
  if (!data || data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center border rounded-md bg-gray-50">
        <p className="text-gray-500">No category time distribution data available</p>
      </div>
    );
  }
  
  // Transform the data for the chart
  // We need to have each time period as an object with counts for each category
  const transformedData = (() => {
    const timeLabels = new Set<string>();
    
    // Collect all time labels
    data.forEach(categoryData => {
      categoryData.values.forEach(value => {
        timeLabels.add(value.timeLabel);
      });
    });
    
    // Create objects for each time label with counts for each category
    return Array.from(timeLabels).sort().map(timeLabel => {
      const timeObj: Record<string, any> = { timeLabel };
      
      data.forEach(categoryData => {
        const value = categoryData.values.find(v => v.timeLabel === timeLabel);
        timeObj[categoryData.category] = value ? value.count : 0;
      });
      
      return timeObj;
    });
  })();
  
  const toggleCategory = (category: string) => {
    if (visibleCategories.includes(category)) {
      setVisibleCategories(visibleCategories.filter(c => c !== category));
    } else {
      setVisibleCategories([...visibleCategories, category]);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {data.map((category, index) => (
          <button
            key={category.category}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              visibleCategories.includes(category.category)
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => toggleCategory(category.category)}
          >
            {category.category}
          </button>
        ))}
      </div>
      
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
            {data.map((category, index) => (
              visibleCategories.includes(category.category) && (
                <Line
                  key={category.category}
                  type="monotone"
                  dataKey={category.category}
                  name={category.category}
                  stroke={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
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
  );
};
