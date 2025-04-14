
import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { useToast } from '@/hooks/use-toast';
import { BulkActionButtons } from '@/components/dashboard/BulkActionButtons';
import { FeedbackCategoryDialog } from '@/components/dashboard/FeedbackCategoryDialog';
import { Feedback, mockCategories, mockSubcategories } from '@/models/feedback';
import { supabase } from '@/integrations/supabase/client';
import { useFeedbackData, FeedbackFilter } from '@/hooks/useFeedbackData';
import { LoadingState } from '@/components/dashboard/LoadingState';
import { ErrorState } from '@/components/dashboard/ErrorState';
import { DashboardContent } from '@/components/dashboard/DashboardContent';
import { DashboardStats } from '@/components/dashboard/DashboardStats';

const Dashboard: React.FC = () => {
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const { toast } = useToast();
  
  const [filter, setFilter] = useState<FeedbackFilter>({
    channel: null,
    year: null,
    month: null,
    ratingMin: 1,
    ratingMax: 5
  });
  
  const { data: feedbackData, isLoading, error } = useFeedbackData(filter);

  const handleFilterChange = (filters: FeedbackFilter) => {
    console.log("Filters changed:", filters);
    setFilter(filters);
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your data is being prepared for export.",
    });
  };
  
  const handleCategoryChange = async (feedbackId: string, category: string, subcategory: string) => {
    try {
      const { error } = await supabase
        .from('customer_feedback')
        .update({ 
          category: category || null, 
          sub_category: subcategory || null
        })
        .eq('id', feedbackId);
      
      if (error) throw error;
      
      toast({
        title: "Categories Updated",
        description: "Feedback categories have been updated successfully.",
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error updating categories:', error);
      toast({
        title: "Update Failed",
        description: "There was an error updating the categories.",
        variant: "destructive",
      });
    }
  };
  
  const openTagDialog = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setIsDialogOpen(true);
  };
  
  const handleBulkTag = () => {
    toast({
      title: "Bulk Tagging",
      description: `${selectedRows.length} rows selected for tagging.`,
    });
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error as Error} />;
  }

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Review Dashboard" 
        description="Browse and manage feedback entries"
      >
        <BulkActionButtons 
          selectedRows={selectedRows} 
          onExport={handleExport} 
          onBulkTag={handleBulkTag} 
        />
      </PageHeader>
      
      <DashboardStats />
      
      <DashboardContent
        feedbackData={feedbackData || []}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        openTagDialog={openTagDialog}
        onFilterChange={handleFilterChange}
        categories={mockCategories}
        subcategories={mockSubcategories}
      />
      
      <FeedbackCategoryDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedFeedback={selectedFeedback}
        onSave={handleCategoryChange}
        categories={mockCategories}
        subcategories={mockSubcategories}
      />
    </div>
  );
};

export default Dashboard;
