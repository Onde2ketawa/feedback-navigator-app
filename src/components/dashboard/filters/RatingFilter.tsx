
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RatingFilterProps {
  ratingRange: number[];
  onRatingChange: (values: number[]) => void;
  isLoading?: boolean;
  error?: Error | null;
}

const RATING_OPTIONS = [
  { value: '1-5', label: 'All Ratings (1-5)', range: [1, 5] },
  { value: '1-1', label: 'Rating 1 only', range: [1, 1] },
  { value: '2-2', label: 'Rating 2 only', range: [2, 2] },
  { value: '3-3', label: 'Rating 3 only', range: [3, 3] },
  { value: '4-4', label: 'Rating 4 only', range: [4, 4] },
  { value: '5-5', label: 'Rating 5 only', range: [5, 5] },
  { value: '1-2', label: 'Low Ratings (1-2)', range: [1, 2] },
  { value: '3-3', label: 'Medium Rating (3)', range: [3, 3] },
  { value: '4-5', label: 'High Ratings (4-5)', range: [4, 5] },
];

export const RatingFilter: React.FC<RatingFilterProps> = ({ 
  ratingRange, 
  onRatingChange,
  isLoading = false,
  error = null
}) => {
  // Ensure rating range is valid
  const validRatingRange = ratingRange && ratingRange.length === 2 
    ? ratingRange 
    : [1, 5];

  // Find current selection
  const currentOption = RATING_OPTIONS.find(option => 
    option.range[0] === validRatingRange[0] && option.range[1] === validRatingRange[1]
  );

  const handleRatingChange = (value: string) => {
    const selectedOption = RATING_OPTIONS.find(option => option.value === value);
    if (selectedOption) {
      onRatingChange(selectedOption.range);
    }
  };

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
        Rating Filter
      </label>
      {isLoading ? (
        <Skeleton className="h-10 w-full" />
      ) : (
        <Select
          value={currentOption?.value || '1-5'}
          onValueChange={handleRatingChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select rating range" />
          </SelectTrigger>
          <SelectContent>
            {RATING_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};
