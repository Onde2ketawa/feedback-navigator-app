
import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="flex items-center justify-center h-[50vh]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2">Loading feedback data...</span>
    </div>
  );
}
