
import React from 'react';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  count?: number;
}

export function RatingInput({
  value,
  onChange,
  disabled = false,
  count = 5,
}: RatingInputProps) {
  const stars = Array.from({ length: count }, (_, i) => i + 1);
  
  return (
    <div className="flex items-center space-x-1">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !disabled && onChange(star)}
          className={cn(
            "rounded-md p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            disabled && "cursor-default opacity-70"
          )}
          disabled={disabled}
        >
          <Star
            className={cn(
              "h-6 w-6 transition-colors",
              star <= value ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
            )}
          />
          <span className="sr-only">Rate {star} stars</span>
        </button>
      ))}
    </div>
  );
}
