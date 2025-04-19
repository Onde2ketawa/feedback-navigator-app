
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface CategoryRating {
  name: string;
  rating: number;
}

interface CategoryRatingBarChartProps {
  categoryRatings: CategoryRating[];
}

export const CategoryRatingBarChart: React.FC<CategoryRatingBarChartProps> = ({
  categoryRatings
}) => {
  // Ensure we have valid ratings data
  const validData = categoryRatings.map(item => ({
    name: item.name,
    rating: typeof item.rating === 'number' && !isNaN(item.rating) 
      ? Math.min(Math.max(item.rating, 0), 5) 
      : 0
  }));

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={validData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" stroke="#64748b" />
          <YAxis
            stroke="#64748b"
            domain={[0, 5]}
            ticks={[0, 1, 2, 3, 4, 5]}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip formatter={(value) => [`${value}`, 'Average Rating']} />
          <Legend />
          <Bar dataKey="rating" fill="#8b5cf6" name="Average Rating" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
