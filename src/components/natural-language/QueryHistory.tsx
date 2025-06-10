
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History } from 'lucide-react';

interface QueryHistory {
  id: string;
  query: string;
  timestamp: Date;
  resultType: string;
}

interface QueryHistoryProps {
  queryHistory: QueryHistory[];
  onSelectQuery: (query: string) => void;
}

export const QueryHistoryComponent: React.FC<QueryHistoryProps> = ({ queryHistory, onSelectQuery }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Query History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {queryHistory.map((item) => (
            <div 
              key={item.id}
              className="p-3 border rounded-lg cursor-pointer hover:bg-muted"
              onClick={() => onSelectQuery(item.query)}
            >
              <p className="text-sm font-medium line-clamp-2">{item.query}</p>
              <div className="flex items-center justify-between mt-1">
                <Badge variant="outline" className="text-xs">
                  {item.resultType}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {item.timestamp.toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
