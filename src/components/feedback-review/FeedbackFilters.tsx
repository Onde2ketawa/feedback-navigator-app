
import React from 'react';
import { FilterContainer } from '@/components/dashboard/filters/FilterContainer';
import { ChannelFilter } from '@/components/dashboard/filters/ChannelFilter';
import { TimeFilter } from '@/components/dashboard/filters/TimeFilter';
import { RatingFilter } from '@/components/dashboard/filters/RatingFilter';
import { useFilterOptions } from '@/hooks/useFilterOptions';
import { Card } from '@/components/ui/card';
import { ChevronDown, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface FeedbackFiltersProps {
  selectedChannel: string;
  selectedYear: string;
  selectedMonth: string;
  ratingRange: [number, number];
  onChannelChange: (channel: string) => void;
  onYearChange: (year: string) => void;
  onMonthChange: (month: string) => void;
  onRatingChange: (range: [number, number]) => void;
}

export function FeedbackFilters({
  selectedChannel,
  selectedYear,
  selectedMonth,
  ratingRange,
  onChannelChange,
  onYearChange,
  onMonthChange,
  onRatingChange,
}: FeedbackFiltersProps) {
  const {
    availableChannels,
    availableYears,
    availableMonths,
    isLoading: isLoadingOptions,
    fetchMonthsForYear
  } = useFilterOptions();

  const [isOpen, setIsOpen] = React.useState(true);

  React.useEffect(() => {
    if (selectedYear !== 'all') {
      fetchMonthsForYear(selectedYear);
    }
  }, [selectedYear, fetchMonthsForYear]);

  return (
    <Card className="p-4 shadow-md border border-gray-200 dark:border-gray-700">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Filter Feedback</h3>
          </div>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div className="space-y-4">
              <ChannelFilter
                selectedChannel={selectedChannel}
                onChannelChange={onChannelChange}
                availableChannels={availableChannels}
                isLoading={isLoadingOptions}
              />
            </div>

            <div className="space-y-4 md:col-span-2 lg:col-span-1">
              <TimeFilter
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
                onYearChange={onYearChange}
                onMonthChange={onMonthChange}
                availableYears={availableYears}
                availableMonths={availableMonths}
                isLoading={isLoadingOptions}
              />
            </div>

            <div className="space-y-4">
              <RatingFilter
                ratingRange={ratingRange}
                onRatingChange={onRatingChange}
                isLoading={isLoadingOptions}
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
