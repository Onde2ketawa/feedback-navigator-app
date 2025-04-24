
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FeedbackFilters } from '@/components/feedback-review/FeedbackFilters';
import { FeedbackTable } from '@/components/feedback-review/FeedbackTable';
import { useFeedbackReview } from '@/hooks/useFeedbackReview';
import type { SortField } from '@/hooks/useFeedbackReview';
import { PageHeader } from '@/components/ui/page-header';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert } from "lucide-react";

const FeedbackReview = () => {
  const navigate = useNavigate();
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
    isAuthenticated,
    isAdmin,
  } = useFeedbackReview();

  // Redirect to auth page if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/auth', { state: { from: '/feedback-review' } });
    }
  }, [isLoading, isAuthenticated, navigate]);

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

  // If not admin, show access denied
  if (!isAdmin) {
    return (
      <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader 
          title="Access Denied"
          description="You don't have permission to access this page"
        />
        <Alert variant="destructive" className="mt-6">
          <ShieldAlert className="h-5 w-5" />
          <AlertTitle>Access Restricted</AlertTitle>
          <AlertDescription>
            This page requires administrator privileges. Please contact your system administrator for access.
          </AlertDescription>
        </Alert>
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
