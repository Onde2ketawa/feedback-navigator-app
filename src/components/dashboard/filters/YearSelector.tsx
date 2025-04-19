
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface YearSelectorProps {
  availableYears: string[];
  selectedYear: string;
  onYearChange: (value: string) => void;
  isLoading?: boolean;
}

export const YearSelector: React.FC<YearSelectorProps> = ({
  availableYears,
  selectedYear,
  onYearChange,
  isLoading = false
}) => {
  // Ensure we always have at least the 'all' option even if no years are provided
  const displayYears = availableYears.length > 0 ? availableYears : ['all'];
  
  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
        <CalendarIcon className="h-3.5 w-3.5 text-primary" />
        Year
      </label>
      {isLoading ? (
        <div className="relative">
          <Skeleton className="h-10 w-full bg-gray-100 dark:bg-gray-800" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-4 w-4 text-primary animate-spin" />
          </div>
        </div>
      ) : (
        <Select
          value={selectedYear}
          onValueChange={onYearChange}
        >
          <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 z-50 shadow-md">
            {displayYears.length <= 1 ? (
              <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                No years available
              </div>
            ) : (
              displayYears.map(year => (
                <SelectItem 
                  key={year} 
                  value={year}
                  className={cn(
                    year === selectedYear ? "bg-gray-100 dark:bg-gray-700 text-primary font-medium" : "",
                    "relative pl-8 pr-2 py-2 rounded-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  )}
                >
                  {year === 'all' ? 'All Years' : year}
                  {year === selectedYear && (
                    <Badge 
                      variant="outline" 
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary/10 text-primary text-xs"
                    >
                      Selected
                    </Badge>
                  )}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};
