
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FilterContainerProps {
  title?: string;
  children: React.ReactNode;
}

export const FilterContainer: React.FC<FilterContainerProps> = ({ 
  title = "Filter Feedback", 
  children 
}) => {
  return (
    <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 pt-2">
        {children}
      </CardContent>
    </Card>
  );
};
