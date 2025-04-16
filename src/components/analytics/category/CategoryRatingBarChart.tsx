
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
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={categoryRatings}
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
            ticks={[1, 2, 3, 4, 5]}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="rating" fill="#8b5cf6" name="Average Rating" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
