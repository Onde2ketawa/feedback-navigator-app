
import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center h-[50vh] animate-in fade-in duration-500">
      <Loader2 className="h-10 w-10 animate-spin text-primary mb-2" />
      <span className="text-lg font-medium text-muted-foreground">Loading feedback data...</span>
      <p className="text-sm text-muted-foreground mt-2">
        This may take a few moments
      </p>
    </div>
  );
}
