
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFeedbackCount } from '@/hooks/useFeedbackCount';
import { Loader2, Calendar } from 'lucide-react';

interface FeedbackYearCounterProps {
  year?: string; // Made optional with default value
}

export function FeedbackYearCounter({ year = '2025' }: FeedbackYearCounterProps) { // Default to '2025'
  const { data: count, isLoading, error } = useFeedbackCount(year);
  
  if (error) {
    return (
      <Card>
        <CardContent className="p-4">
          <p className="text-red-500 text-sm">Error loading feedback count</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Feedback Tahun {year}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading...</span>
          </div>
        ) : (
          <div className="text-2xl font-bold">
            {count?.toLocaleString('id-ID')} feedback
          </div>
        )}
      </CardContent>
    </Card>
  );
}
