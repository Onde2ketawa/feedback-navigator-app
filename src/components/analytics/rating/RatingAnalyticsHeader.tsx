
import React from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface RatingAnalyticsHeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
}

export const RatingAnalyticsHeader: React.FC<RatingAnalyticsHeaderProps> = ({
  onRefresh,
  isLoading
}) => {
  return (
    <div className="flex justify-between items-center">
      <PageHeader 
        title="Rating Analytics" 
        description="Analyze rating trends and distributions over time"
      />
      
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1"
        onClick={onRefresh}
        disabled={isLoading}
      >
        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        Refresh
      </Button>
    </div>
  );
};
