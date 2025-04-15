
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface TimeFilterErrorProps {
  error: Error | null;
}

export const TimeFilterError: React.FC<TimeFilterErrorProps> = ({ error }) => {
  if (!error) return null;
  
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4 mr-2" />
      <AlertDescription>
        Unable to load time filters: {error.message}
      </AlertDescription>
    </Alert>
  );
};
