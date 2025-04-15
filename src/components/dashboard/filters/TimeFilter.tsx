
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MonthOption } from '@/hooks/useFilterOptions';

interface TimeFilterProps {
  availableYears: string[];
  availableMonths: MonthOption[];
  selectedYear: string;
  selectedMonth: string;
  onYearChange: (value: string) => void;
  onMonthChange: (value: string) => void;
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
            <SelectTrigger>
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
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
            <SelectTrigger>
              <SelectValue placeholder={selectedYear === 'all' ? 'Select Year First' : 'Select Month'} />
            </SelectTrigger>
            <SelectContent>
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
  );
};
