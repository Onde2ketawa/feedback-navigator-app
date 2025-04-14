
import React from 'react';

interface ErrorStateProps {
  error: Error;
}

export function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className="p-8 text-center text-red-500">
      <h2 className="text-xl font-bold mb-2">Error loading data</h2>
      <p>{error.message}</p>
    </div>
  );
}
