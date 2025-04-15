
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { MonthOption } from '@/hooks/useFilterOptions';

interface TimeFilterProps {
  availableYears: string[];
  availableMonths: MonthOption[];
  selectedYear: string;
  selectedMonth: string;
  onYearChange: (value: string) => void;
  onMonthChange: (value: string) => void;
}

export const TimeFilter: React.FC<TimeFilterProps> = ({ 
  availableYears, 
  availableMonths, 
  selectedYear, 
  selectedMonth,
  onYearChange,
  onMonthChange
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-2">Year</label>
        <Select
          value={selectedYear}
          onValueChange={onYearChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            {availableYears.map(year => (
              <SelectItem key={year} value={year}>
                {year === 'all' ? 'All Years' : year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Month</label>
        <Select
          value={selectedMonth}
          onValueChange={onMonthChange}
          disabled={selectedYear === 'all'}
        >
          <SelectTrigger>
            <SelectValue placeholder={selectedYear === 'all' ? 'Select Year First' : 'Select Month'} />
          </SelectTrigger>
          <SelectContent>
            {availableMonths.map(month => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
