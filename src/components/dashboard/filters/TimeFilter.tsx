
import React from 'react';
import { MonthOption } from '@/hooks/useFilterOptions';
import { YearSelector } from './YearSelector';
import { MonthSelector } from './MonthSelector';
import { TimeFilterReset } from './TimeFilterReset';
import { TimeFilterError } from './TimeFilterError';
import { Separator } from '@/components/ui/separator';

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
    return <TimeFilterError error={error} />;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <YearSelector 
          availableYears={availableYears}
          selectedYear={selectedYear}
          onYearChange={onYearChange}
          isLoading={isLoading}
        />

        <MonthSelector 
          availableMonths={availableMonths}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={onMonthChange}
          isLoading={isLoading || isLoadingMonths}
        />
      </div>

      {onReset && <TimeFilterReset onReset={onReset} />}
    </div>
  );
};
