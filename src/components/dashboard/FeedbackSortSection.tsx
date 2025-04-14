
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FeedbackFilter } from '@/hooks/useFeedbackData';

interface SortSectionProps {
  onFilterChange: (filters: FeedbackFilter) => void;
}

export const FeedbackSortSection: React.FC<SortSectionProps> = ({ onFilterChange }) => {
  const [availableChannels, setAvailableChannels] = useState<string[]>([]);
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [availableMonths, setAvailableMonths] = useState<{value: string, label: string}[]>([]);
  
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [ratingRange, setRatingRange] = useState<number[]>([1, 5]);

  // Fetch filter options from database
  useEffect(() => {
    const fetchFilterOptions = async () => {
      // Fetch unique channels
      const { data: channelsData } = await supabase
        .from('channel')
        .select('name')
        .order('name');
      
      setAvailableChannels([
        'all', 
        ...(channelsData?.map(c => c.name) || [])
      ]);

      // Fetch unique years from submit_date
      const { data: yearsData } = await supabase
        .from('customer_feedback')
        .select('submit_date')
        .not('submit_date', 'is', null);
      
      const uniqueYears = Array.from(
        new Set(yearsData?.map(item => new Date(item.submit_date).getFullYear().toString()))
      ).sort((a, b) => parseInt(b) - parseInt(a)); // Latest year first
      
      setAvailableYears(['all', ...uniqueYears]);
    };

    fetchFilterOptions();
  }, []);

  // Fetch months when year changes
  useEffect(() => {
    const fetchMonthsForYear = async () => {
      if (selectedYear === 'all') {
        setAvailableMonths([{ value: 'all', label: 'All Months' }]);
        return;
      }

      const { data } = await supabase
        .from('customer_feedback')
        .select('submit_date')
        .gte('submit_date', `${selectedYear}-01-01`)
        .lt('submit_date', `${parseInt(selectedYear) + 1}-01-01`);
      
      const months = Array.from(
        new Set(data?.map(item => (new Date(item.submit_date).getMonth() + 1).toString()))
      ).sort((a, b) => parseInt(a) - parseInt(b));
      
      setAvailableMonths([
        { value: 'all', label: 'All Months' },
        ...months.map(m => ({
          value: m,
          label: new Date(2000, parseInt(m) - 1, 1).toLocaleString('default', { month: 'long' })
        }))
      ]);
    };

    fetchMonthsForYear();
  }, [selectedYear]);

  // Apply filters
  const applyFilters = () => {
    onFilterChange({
      channel: selectedChannel === 'all' ? null : selectedChannel,
      year: selectedYear === 'all' ? null : selectedYear,
      month: selectedMonth === 'all' ? null : selectedMonth,
      ratingMin: ratingRange[0],
      ratingMax: ratingRange[1]
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Feedback</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Channel Select */}
        <div>
          <label className="block text-sm font-medium mb-2">Channel</label>
          <Select 
            value={selectedChannel} 
            onValueChange={(value) => {
              setSelectedChannel(value);
              // Reset year and month when channel changes
              setSelectedYear('all');
              setSelectedMonth('all');
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Channel" />
            </SelectTrigger>
            <SelectContent>
              {availableChannels.map(channel => (
                <SelectItem key={channel} value={channel}>
                  {channel === 'all' ? 'All Channels' : channel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Year-Month Select */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Year</label>
            <Select
              value={selectedYear}
              onValueChange={(val) => {
                setSelectedYear(val);
                setSelectedMonth('all'); // Reset month when year changes
              }}
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
              onValueChange={setSelectedMonth}
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

        {/* Rating Range */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Rating: {ratingRange[0]} - {ratingRange[1]}
          </label>
          <Slider
            min={1}
            max={5}
            step={1}
            value={ratingRange}
            onValueChange={setRatingRange}
          />
        </div>

        <Button onClick={applyFilters} className="w-full mt-4">
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  );
};
