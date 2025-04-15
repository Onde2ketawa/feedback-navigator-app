
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

interface TimeFilterResetProps {
  onReset: () => void;
}

export const TimeFilterReset: React.FC<TimeFilterResetProps> = ({ onReset }) => {
  return (
    <div className="flex justify-end">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onReset}
        className="flex items-center gap-1 text-xs bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300"
      >
        <RefreshCcw className="h-3 w-3 text-gray-500" />
        Reset Date Filters
      </Button>
    </div>
  );
};
