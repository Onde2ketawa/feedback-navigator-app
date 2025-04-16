
import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
}

export const RatingStars: React.FC<RatingStarsProps> = ({ 
  rating, 
  maxRating = 5 
}) => {
  return (
    <div className="flex">
      {Array.from({ length: maxRating }).map((_, i) => (
        <Star 
          key={i} 
          className={`h-3 w-3 sm:h-4 sm:w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
};
