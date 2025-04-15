
import React from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface ApplyFiltersButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

export const ApplyFiltersButton: React.FC<ApplyFiltersButtonProps> = ({ 
  onClick, 
  isLoading 
}) => {
  return (
    <Button 
      onClick={onClick} 
      className="w-full mt-4"
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Skeleton className="h-4 w-4 rounded-full mr-2" /> 
          Applying...
        </>
      ) : (
        'Apply Filters'
      )}
    </Button>
  );
};
