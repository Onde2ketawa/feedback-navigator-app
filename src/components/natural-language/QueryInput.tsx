
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Search, Download } from 'lucide-react';

interface QueryInputProps {
  query: string;
  setQuery: (query: string) => void;
  isProcessing: boolean;
  hasResult: boolean;
  onSubmit: () => void;
  hasData: boolean;
}

const sampleQueries = [
  "Show feedback by channel as a pie chart",
  "Display average rating by sentiment in table format",
  "Create a line chart of feedback over time"
];

export const QueryInput: React.FC<QueryInputProps> = ({
  query,
  setQuery,
  isProcessing,
  hasResult,
  onSubmit,
  hasData
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Ask Your Question
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Type your question here... e.g., 'Show feedback by channel as a pie chart'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={onSubmit}
            disabled={isProcessing || !query.trim() || !hasData}
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            {isProcessing ? 'Processing...' : 'Generate Visualization'}
          </Button>
          
          {hasResult && (
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          )}
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium">Try these sample queries:</p>
          <div className="flex flex-wrap gap-2">
            {sampleQueries.map((sample, index) => (
              <Badge 
                key={index}
                variant="outline" 
                className="cursor-pointer hover:bg-muted"
                onClick={() => setQuery(sample)}
              >
                {sample}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
