
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
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  );
};
