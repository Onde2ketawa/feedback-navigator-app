
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FeedbackFilter } from '@/hooks/useFeedbackData';
import { useFilterOptions } from '@/hooks/useFilterOptions';
import { useFeedbackFilters } from './filters/useFeedbackFilters';

interface SortSectionProps {
  onFilterChange: (filters: FeedbackFilter) => void;
  categories: { id: string; name: string }[];
  subcategories: { id: string; name: string; category_id: string }[];
}

export const FeedbackSortSection: React.FC<SortSectionProps> = ({ 
  onFilterChange, 
  categories, 
  subcategories 
}) => {
  const { 
    availableChannels, 
    availableYears, 
    availableMonths,
    isLoading,
    isLoadingMonths
  } = useFilterOptions();

  // Add debug logging to see what's coming from the hook
  console.log("FeedbackSortSection available months:", availableMonths);

  const {
    selectedChannel,
    selectedYear,
    selectedMonth,
    selectedCategory,
    selectedSubcategory,
    ratingRange,
    handleChannelChange,
    handleYearChange,
    handleMonthChange,
    handleCategoryChange,
    handleSubcategoryChange,
    setRatingRange,
    applyFilters
  } = useFeedbackFilters();

  // Filter subcategories based on selected category
  const filteredSubcategories = selectedCategory === 'all' 
    ? []
    : subcategories.filter(subcat => subcat.category_id === selectedCategory);

  const handleFilterSubmit = () => {
    applyFilters(onFilterChange);
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
              value={selectedChannel}
              onValueChange={handleChannelChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select channel" />
              </SelectTrigger>
              <SelectContent>
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
              value={selectedYear}
              onValueChange={handleYearChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year === 'all' ? 'All Years' : year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Month Filter */}
          <div className="space-y-2 w-full md:w-64">
            <label className="text-sm font-medium">Month</label>
            <Select
              disabled={isLoading || isLoadingMonths || selectedYear === 'all'}
              value={selectedMonth}
              onValueChange={handleMonthChange}
            >
              <SelectTrigger>
                <SelectValue placeholder={selectedYear === 'all' ? "Select year first" : "Select month"} />
              </SelectTrigger>
              <SelectContent>
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
              value={`${ratingRange[0]}-${ratingRange[1]}`}
              onValueChange={(value) => {
                const [min, max] = value.split('-').map(Number);
                setRatingRange([min, max]);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select rating range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-5">All Ratings (1-5)</SelectItem>
                <SelectItem value="1-2">1-2 Stars</SelectItem>
                <SelectItem value="3-3">3 Stars</SelectItem>
                <SelectItem value="4-5">4-5 Stars</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Second row for Category and Sub Category */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          {/* Category Filter */}
          <div className="space-y-2 w-full md:w-64">
            <label className="text-sm font-medium">Category</label>
            <Select
              value={selectedCategory}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sub Category Filter */}
          <div className="space-y-2 w-full md:w-64">
            <label className="text-sm font-medium">Sub Category</label>
            <Select
              disabled={selectedCategory === 'all'}
              value={selectedSubcategory}
              onValueChange={handleSubcategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder={selectedCategory === 'all' ? "Select category first" : "Select subcategory"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sub Categories</SelectItem>
                {filteredSubcategories.map((subcategory) => (
                  <SelectItem key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Apply Filters Button */}
        <div className="flex justify-end">
          <button
            onClick={handleFilterSubmit}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
