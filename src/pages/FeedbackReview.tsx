
import React from 'react';
import { FeedbackFilters } from '@/components/feedback-review/FeedbackFilters';
import { FeedbackTable } from '@/components/feedback-review/FeedbackTable';
import { useFeedbackReview } from '@/hooks/useFeedbackReview';
import type { SortField } from '@/hooks/useFeedbackReview';

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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Feedback Review</h1>
      
      <div className="space-y-6">
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

        <FeedbackTable
          data={feedbackData || []}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
        />
      </div>
    </div>
  );
};

export default FeedbackReview;
