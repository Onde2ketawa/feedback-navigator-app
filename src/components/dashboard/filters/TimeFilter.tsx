import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, RefreshCcw, Calendar, ChevronDown, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { MonthOption } from '@/hooks/useFilterOptions';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface TimeFilterProps {
  availableYears: string[];
  availableMonths: MonthOption[];
  selectedYear: string;
  selectedMonth: string;
  onYearChange: (value: string) => void;
  onMonthChange: (value: string) => void;
  onReset?: () => void;
  isLoading?: boolean;
  isLoadingMonths?: boolean;
  error?: Error | null;
}

export const TimeFilter: React.FC<TimeFilterProps> = ({ 
  availableYears, 
  availableMonths, 
  selectedYear, 
  selectedMonth,
  onYearChange,
  onMonthChange,
  onReset,
  isLoading = false,
  isLoadingMonths = false,
  error = null
}) => {
  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4 mr-2" />
        <AlertDescription>
          Unable to load time filters: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-1.5 text-sm font-medium mb-2 text-gray-700">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            Year
          </label>
          {isLoading ? (
            <div className="relative">
              <Skeleton className="h-10 w-full bg-gray-100" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-4 w-4 text-primary animate-spin" />
              </div>
            </div>
          ) : (
            <Select
              value={selectedYear}
              onValueChange={onYearChange}
            >
              <SelectTrigger className="bg-white border-gray-200 hover:bg-gray-50 transition-colors">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50 shadow-md">
                {availableYears.length <= 1 ? (
                  <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                    No years available
                  </div>
                ) : (
                  availableYears.map(year => (
                    <SelectItem 
                      key={year} 
                      value={year}
                      className={year === selectedYear ? "bg-gray-100 text-primary font-medium" : ""}
                    >
                      {year === 'all' ? 'All Years' : year}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-sm font-medium mb-2 text-gray-700">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            Month
          </label>
          {isLoading || isLoadingMonths ? (
            <div className="relative">
              <Skeleton className="h-10 w-full bg-gray-100" />
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
                      <SelectTrigger className={`bg-white border-gray-200 transition-colors ${selectedYear !== 'all' ? 'hover:bg-gray-50' : ''}`}>
                        <SelectValue placeholder={selectedYear === 'all' ? 'Select Year First' : 'Select Month'} />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50 shadow-md">
                        {availableMonths.length <= 1 ? (
                          <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                            {selectedYear !== 'all' ? 'No months available for selected year' : 'Select a year first'}
                          </div>
                        ) : (
                          availableMonths.map(month => (
                            <SelectItem 
                              key={month.value} 
                              value={month.value}
                              className={month.value === selectedMonth ? "bg-gray-100 text-primary font-medium" : ""}
                            >
                              {month.label}
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
      </div>

      {onReset && (
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onReset}
            className="flex items-center gap-1 text-xs bg-white hover:bg-gray-50"
          >
            <RefreshCcw className="h-3 w-3 text-gray-500" />
            Reset Date Filters
          </Button>
        </div>
      )}
    </div>
  );
};
