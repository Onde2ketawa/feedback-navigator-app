
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
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MonthOption } from '@/hooks/useFilterOptions';

interface MonthSelectorProps {
  availableMonths: MonthOption[];
  selectedMonth: string;
  selectedYear: string;
  onMonthChange: (value: string) => void;
  isLoading?: boolean;
}

export const MonthSelector: React.FC<MonthSelectorProps> = ({
  availableMonths,
  selectedMonth,
  selectedYear,
  onMonthChange,
  isLoading = false
}) => {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
        <CalendarIcon className="h-3.5 w-3.5 text-primary" />
        Month
      </label>
      {isLoading ? (
        <div className="relative">
          <Skeleton className="h-10 w-full bg-gray-100 dark:bg-gray-800" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-4 w-4 text-primary animate-spin" />
          </div>
        </div>
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Select
                  value={selectedMonth}
                  onValueChange={onMonthChange}
                  disabled={selectedYear === 'all'}
                >
                  <SelectTrigger 
                    className={cn(
                      "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors",
                      selectedYear !== 'all' ? "hover:bg-gray-50 dark:hover:bg-gray-700" : "",
                      selectedYear === 'all' ? "opacity-70 cursor-not-allowed" : ""
                    )}
                  >
                    <SelectValue placeholder={selectedYear === 'all' ? 'Select Year First' : 'Select Month'} />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 z-50 shadow-md">
                    {availableMonths.length <= 1 ? (
                      <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                        {selectedYear !== 'all' ? 'No months available for selected year' : 'Select a year first'}
                      </div>
                    ) : (
                      availableMonths.map(month => (
                        <SelectItem 
                          key={month.value} 
                          value={month.value}
                          className={cn(
                            month.value === selectedMonth ? "bg-gray-100 dark:bg-gray-700 text-primary font-medium" : "",
                            "relative pl-8 pr-2 py-2 rounded-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          )}
                        >
                          {month.label}
                          {month.value === selectedMonth && (
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
              </div>
            </TooltipTrigger>
            {selectedYear === 'all' && (
              <TooltipContent side="bottom" className="bg-gray-800 text-white text-xs">
                Please select a year first
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};
