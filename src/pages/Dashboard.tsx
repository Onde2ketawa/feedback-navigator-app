
import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { FeedbackCategoryDialog } from '@/components/dashboard/FeedbackCategoryDialog';
import { useFeedbackData, FeedbackFilter } from '@/hooks/useFeedbackData';
import { FeedbackDataWrapper } from '@/components/dashboard/FeedbackDataWrapper';
import { DashboardContent } from '@/components/dashboard/DashboardContent';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { DashboardActions } from '@/components/dashboard/DashboardActions';
import { useCategoryDialog } from '@/components/dashboard/useCategoryDialog';
import { useCategoryQueries } from '@/hooks/categories/useCategoryQueries';

const Dashboard: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  
  const [filter, setFilter] = useState<FeedbackFilter>({
    channel: null,
    year: '2024', // Default to 2024 instead of null
    month: null,
    ratingMin: 1,
    ratingMax: 5
  });
  
  const { data: feedbackData, isLoading, error, refetch } = useFeedbackData(filter);
  const { 
    selectedFeedback, 
    isDialogOpen, 
    setIsDialogOpen, 
    handleCategoryChange, 
    openTagDialog 
  } = useCategoryDialog();
  
  const { categories, subcategories, isLoading: categoriesLoading } = useCategoryQueries();
  
  const handleFilterChange = (filters: FeedbackFilter) => {
    console.log("Applying filters:", filters);
    setFilter(filters);
  };
  
  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Review Dashboard" 
        description="Browse and manage feedback entries"
      >
        <DashboardActions 
          selectedRows={selectedRows}
          filter={filter}
          onRefetch={refetch}
        />
      </PageHeader>
      
      <FeedbackDataWrapper
        feedbackData={feedbackData}
        isLoading={isLoading}
        error={error}
        filter={filter}
      >
        <DashboardStats />
        
        <DashboardContent
          feedbackData={feedbackData || []}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          openTagDialog={openTagDialog}
          onFilterChange={handleFilterChange}
          categories={categories || []}
          subcategories={subcategories || []}
        />
      </FeedbackDataWrapper>
      
      <FeedbackCategoryDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedFeedback={selectedFeedback}
        onSave={handleCategoryChange}
        categories={categories || []}
        subcategories={subcategories || []}
      />
    </div>
  );
};

export default Dashboard;
