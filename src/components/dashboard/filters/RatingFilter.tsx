
import React from 'react';
import { Slider } from '@/components/ui/slider';

interface RatingFilterProps {
  ratingRange: number[];
  onRatingChange: (values: number[]) => void;
}

export const RatingFilter: React.FC<RatingFilterProps> = ({ 
  ratingRange, 
  onRatingChange 
}) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Rating: {ratingRange[0]} - {ratingRange[1]}
      </label>
      <Slider
        min={1}
        max={5}
        step={1}
        value={ratingRange}
        onValueChange={onRatingChange}
      />
    </div>
  );
};
