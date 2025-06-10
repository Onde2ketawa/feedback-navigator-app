
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface HelpSectionProps {
  onSelectQuery: (query: string) => void;
}

const additionalSamples = [
  "Show rating distribution as a bar chart",
  "Display sentiment breakdown in a table",
  "Show feedback count by device type"
];

export const HelpSection: React.FC<HelpSectionProps> = ({ onSelectQuery }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>How to Use</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm space-y-2">
          <p><strong>Chart Types:</strong> pie, bar, line, table</p>
          <p><strong>Data Sources:</strong> feedback, channels, sentiment, ratings</p>
          <p><strong>Time Periods:</strong> over time, by month, trends</p>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium">More Examples:</p>
          {additionalSamples.map((sample, index) => (
            <Badge 
              key={index}
              variant="outline" 
              className="block w-full text-left cursor-pointer hover:bg-muted p-2 h-auto"
              onClick={() => onSelectQuery(sample)}
            >
              {sample}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
