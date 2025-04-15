
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

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
      className="w-full mt-6 bg-primary hover:bg-primary/90 text-white font-medium"
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" /> 
          Applying...
        </>
      ) : (
        'Apply Filters'
      )}
    </Button>
  );
};
