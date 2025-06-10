
import React from 'react';
import { FeedbackFilters } from '@/components/feedback-review/FeedbackFilters';
import { FeedbackTable } from '@/components/feedback-review/FeedbackTable';
import { ExportButtons } from '@/components/feedback-review/ExportButtons';
import { useFeedbackReview } from '@/hooks/useFeedbackReview';
import type { SortField } from '@/hooks/useFeedbackReview';
import { PageHeader } from '@/components/ui/page-header';
import { useFeedbackStats } from '@/hooks/useFeedbackStats';
import { FeedbackFilter } from '@/hooks/useFeedbackData';

const FeedbackReview = () => {
  const {
    feedbackData,
    isLoading,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    selectedChannel,
    setSelectedChannel,
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    ratingRange,
    setRatingRange,
  } = useFeedbackReview();

  // Create filter object to match useFeedbackStats format
  const filter: FeedbackFilter = {
    channel: selectedChannel === 'all' ? null : selectedChannel,
    year: selectedYear === 'all' ? null : selectedYear,
    month: selectedMonth === 'all' ? null : selectedMonth,
    category: null,
    subcategory: null,
    sentiment: null,
    ratingMin: ratingRange[0],
    ratingMax: ratingRange[1]
  };

  const { data: stats } = useFeedbackStats(filter);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader 
        title="Feedback Review"
        description="Review and analyze customer feedback data"
      />
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <FeedbackFilters
            selectedChannel={selectedChannel}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            ratingRange={ratingRange}
            onChannelChange={setSelectedChannel}
            onYearChange={setSelectedYear}
            onMonthChange={setSelectedMonth}
            onRatingChange={setRatingRange}
          />
          <ExportButtons data={feedbackData || []} />
        </div>

        <FeedbackTable
          data={feedbackData || []}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
          totalRecords={stats?.totalFeedback}
        />
      </div>
    </div>
  );
};

export default FeedbackReview;
