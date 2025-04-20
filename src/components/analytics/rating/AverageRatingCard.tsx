
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface AverageRatingCardProps {
  rating: number;
}

export const AverageRatingCard: React.FC<AverageRatingCardProps> = ({ rating }) => {
  return (
    <Card className="col-span-1">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{rating}</div>
        <div className="flex items-center mt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < Math.round(rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
