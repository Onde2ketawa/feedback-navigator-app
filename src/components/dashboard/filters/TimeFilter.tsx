
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { MonthOption } from '@/hooks/useFilterOptions';

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
          <label className="block text-sm font-medium mb-2">Year</label>
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select
              value={selectedYear}
              onValueChange={onYearChange}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                {availableYears.length === 0 ? (
                  <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                    No years available
                  </div>
                ) : (
                  availableYears.map(year => (
                    <SelectItem key={year} value={year}>
                      {year === 'all' ? 'All Years' : year}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Month</label>
          {isLoading || isLoadingMonths ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select
              value={selectedMonth}
              onValueChange={onMonthChange}
              disabled={selectedYear === 'all'}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder={selectedYear === 'all' ? 'Select Year First' : 'Select Month'} />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                {availableMonths.length === 0 ? (
                  <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                    No months available
                  </div>
                ) : (
                  availableMonths.map(month => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {onReset && (
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onReset}
            className="flex items-center gap-1 text-xs"
          >
            <RefreshCcw className="h-3 w-3" />
            Reset Date Filters
          </Button>
        </div>
      )}
    </div>
  );
};
