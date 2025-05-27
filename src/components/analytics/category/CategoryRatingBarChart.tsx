
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
  ReferenceLine,
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
  // Ensure we have valid ratings data and properly parse rating values
  const validData = categoryRatings.map(item => {
    // Parse rating to ensure it's a valid number
    const ratingValue = typeof item.rating === 'number' 
      ? item.rating 
      : parseFloat(String(item.rating));
    
    return {
      name: item.name,
      rating: !isNaN(ratingValue) ? Math.min(Math.max(ratingValue, 0), 5) : 0
    };
  });

  // Calculate average rating
  const avgRating = validData.length > 0
    ? validData.reduce((sum, item) => sum + item.rating, 0) / validData.length
    : 0;

  console.log('CategoryRatingBarChart data:', validData);

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={validData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="name" 
            stroke="#64748b" 
            angle={-45}
            textAnchor="end"
            height={100}
            interval={0}
          />
          <YAxis
            stroke="#64748b"
            domain={[0, 5]}
            ticks={[0, 1, 2, 3, 4, 5]}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip formatter={(value) => [`${value}`, 'Average Rating']} />
          <Legend />
          {avgRating > 0 && (
            <ReferenceLine 
              y={avgRating} 
              label={`Avg: ${avgRating.toFixed(1)}`} 
              stroke="#f43f5e" 
              strokeDasharray="3 3" 
            />
          )}
          <Bar dataKey="rating" fill="#8b5cf6" name="Average Rating" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
