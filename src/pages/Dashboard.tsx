
import React, { useState, useEffect } from 'react';
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
import { Button } from '@/components/ui/button';

const Dashboard: React.FC = () => {
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);
  
  const [filter, setFilter] = useState<FeedbackFilter>({
    channel: null,
    year: '2024', // Default to 2024 instead of null
    month: null,
    ratingMin: 1,
    ratingMax: 5
  });
  
  const { data: feedbackData, isLoading, error, refetch } = useFeedbackData(filter);
  
  // Effect to show toast when data is empty
  useEffect(() => {
    if (feedbackData && feedbackData.length === 0 && !isLoading && !error) {
      // Only show the toast if filters have been applied (not on initial load)
      if (filter.channel || filter.year || filter.month) {
        toast({
          title: "No Results Found",
          description: "No feedback matches the selected filters. Try adjusting your criteria or adding test data.",
          variant: "default"
        });
      }
    }
  }, [feedbackData, isLoading, error, filter, toast]);

  const handleFilterChange = (filters: FeedbackFilter) => {
    console.log("Applying filters:", filters);
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
  
  // Function to seed test data
  const seedTestData = async () => {
    try {
      setIsSeeding(true);
      
      // First, ensure we have the MyHana channel
      let channelId;
      
      // Check if channel exists
      const { data: existingChannel, error: channelQueryError } = await supabase
        .from('channel')
        .select('id')
        .eq('name', 'MyHana')
        .single();
      
      if (channelQueryError && channelQueryError.code !== 'PGRST116') {
        // Error other than "no rows returned"
        throw channelQueryError;
      }
      
      if (existingChannel) {
        channelId = existingChannel.id;
      } else {
        // Create channel if it doesn't exist
        const { data: newChannel, error: createError } = await supabase
          .from('channel')
          .insert({ name: 'MyHana' })
          .select('id')
          .single();
        
        if (createError) throw createError;
        channelId = newChannel.id;
      }
      
      // Create sample data for the selected year
      const year = parseInt(filter.year || '2025');
      
      // Create a few records for the selected year
      const testData = [
        {
          channel_id: channelId,
          rating: 4,
          submit_date: `${year}-01-15T10:30:00`,
          feedback: `Test feedback for ${year} January`,
          sentiment: 'positive',
          sentiment_score: 0.8,
          user_id: '00000000-0000-0000-0000-000000000000'
        },
        {
          channel_id: channelId,
          rating: 3,
          submit_date: `${year}-02-20T14:45:00`,
          feedback: `Test feedback for ${year} February`,
          sentiment: 'neutral',
          sentiment_score: 0.5,
          user_id: '00000000-0000-0000-0000-000000000000'
        },
        {
          channel_id: channelId,
          rating: 5,
          submit_date: `${year}-${filter.month || '03'}-25T09:15:00`,
          feedback: `Test feedback for ${year} ${filter.month ? 'selected month' : 'March'}`,
          sentiment: 'positive',
          sentiment_score: 0.9,
          user_id: '00000000-0000-0000-0000-000000000000'
        }
      ];
      
      const { error: insertError } = await supabase
        .from('customer_feedback')
        .insert(testData);
      
      if (insertError) throw insertError;
      
      // Refresh data
      await refetch();
      
      toast({
        title: "Test Data Added",
        description: `Added sample feedback for ${year}`,
      });
    } catch (error) {
      console.error('Error seeding test data:', error);
      toast({
        title: "Error Adding Test Data",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSeeding(false);
    }
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
        <div className="flex gap-2">
          <BulkActionButtons 
            selectedRows={selectedRows} 
            onExport={handleExport} 
            onBulkTag={handleBulkTag} 
          />
          
          <Button 
            variant="outline" 
            onClick={seedTestData}
            disabled={isSeeding}
          >
            {isSeeding ? 'Adding...' : 'Add Test Data'}
          </Button>
        </div>
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
