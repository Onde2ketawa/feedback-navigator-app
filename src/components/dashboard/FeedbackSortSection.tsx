
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowDown, ArrowUp, Filter } from 'lucide-react';
import { FeedbackFilter } from '@/hooks/useFeedbackData';
import { useFilterOptions } from '@/hooks/useFilterOptions';

interface SortSectionProps {
  onFilterChange: (filters: FeedbackFilter) => void;
}

export const FeedbackSortSection: React.FC<SortSectionProps> = ({ onFilterChange }) => {
  const { 
    availableChannels, 
    availableYears, 
    availableMonths,
    fetchMonthsForYear,
    isLoading,
    isLoadingMonths,
    error,
    monthsError
  } = useFilterOptions();

  const handleFilterSubmit = (filters: FeedbackFilter) => {
    onFilterChange({
      channel: filters.channel,
      year: filters.year,
      month: filters.month,
      ratingMin: filters.ratingMin,
      ratingMax: filters.ratingMax
    });
  };

  return (
    <Card className="bg-card">
      <CardContent className="p-6 space-y-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          {/* Channel Filter */}
          <div className="space-y-2 w-full md:w-64">
            <label className="text-sm font-medium">Channel</label>
            <Select
              disabled={isLoading}
              onValueChange={(value) => 
                handleFilterSubmit({ 
                  channel: value, 
                  year: null, 
                  month: null,
                  ratingMin: 1,
                  ratingMax: 5
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Channels</SelectItem>
                {availableChannels.map((channel) => (
                  <SelectItem key={channel.value} value={channel.value}>
                    {channel.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Year Filter */}
          <div className="space-y-2 w-full md:w-64">
            <label className="text-sm font-medium">Year</label>
            <Select
              disabled={isLoading}
              onValueChange={(value) => {
                fetchMonthsForYear(value);
                handleFilterSubmit({ 
                  channel: null, 
                  year: value, 
                  month: null,
                  ratingMin: 1,
                  ratingMax: 5
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Month Filter */}
          <div className="space-y-2 w-full md:w-64">
            <label className="text-sm font-medium">Month</label>
            <Select
              disabled={isLoadingMonths}
              onValueChange={(value) => 
                handleFilterSubmit({ 
                  channel: null, 
                  year: null, 
                  month: value,
                  ratingMin: 1,
                  ratingMax: 5
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                {availableMonths.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Rating Filter */}
          <div className="space-y-2 w-full md:w-64">
            <label className="text-sm font-medium">Rating</label>
            <Select
              onValueChange={(value) => {
                const [min, max] = value.split('-').map(Number);
                handleFilterSubmit({ 
                  channel: null, 
                  year: null, 
                  month: null,
                  ratingMin: min,
                  ratingMax: max
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select rating range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-5">All Ratings</SelectItem>
                <SelectItem value="1-2">1-2 Stars</SelectItem>
                <SelectItem value="3-3">3 Stars</SelectItem>
                <SelectItem value="4-5">4-5 Stars</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {error && (
          <div className="text-sm text-destructive mt-2">
            Error loading filter options. Please try again.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
