
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FilterErrorMessageProps {
  error: Error;
  onRetry: () => void;
}

export const FilterErrorMessage: React.FC<FilterErrorMessageProps> = ({ 
  error, 
  onRetry 
}) => {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex flex-col space-y-2">
        <p>Error loading filters: {error.message}</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="self-start" 
          onClick={onRetry}
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Retry
        </Button>
      </AlertDescription>
    </Alert>
  );
};
