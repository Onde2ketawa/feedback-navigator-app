
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface RatingFilterProps {
  ratingRange: number[];
  onRatingChange: (values: number[]) => void;
  isLoading?: boolean;
  error?: Error | null;
}

export const RatingFilter: React.FC<RatingFilterProps> = ({ 
  ratingRange, 
  onRatingChange,
  isLoading = false,
  error = null
}) => {
  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4 mr-2" />
        <AlertDescription>
          Unable to load rating filter: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Rating: {isLoading ? '...' : `${ratingRange[0]} - ${ratingRange[1]}`}
      </label>
      {isLoading ? (
        <Skeleton className="h-4 w-full" />
      ) : (
        <Slider
          min={1}
          max={5}
          step={1}
          value={ratingRange}
          onValueChange={onRatingChange}
        />
      )}
    </div>
  );
};
