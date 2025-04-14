
import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { FeedbackTable } from '@/components/dashboard/FeedbackTable';
import { BulkActionButtons } from '@/components/dashboard/BulkActionButtons';
import { FeedbackFilters } from '@/components/dashboard/FeedbackFilters';
import { FeedbackCategoryDialog } from '@/components/dashboard/FeedbackCategoryDialog';
import { Feedback, mockCategories, mockSubcategories } from '@/models/feedback';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const { toast } = useToast();
  
  const [filter, setFilter] = useState({
    channel: '',
    rating: 0,
    year: '',
    month: '',
  });
  
  // Fetch feedback data from Supabase
  const { data: feedbackData, isLoading, error } = useQuery({
    queryKey: ['feedback'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customer_feedback')
        .select(`
          id,
          channel:channel_id(name),
          rating,
          submit_date,
          feedback,
          category,
          sub_category,
          sentiment,
          sentiment_score
        `);
      
      if (error) throw error;
      
      // Transform the data to match our Feedback interface
      return data.map(item => ({
        id: item.id,
        channel: item.channel?.name || '',
        rating: item.rating,
        submitDate: item.submit_date || new Date().toISOString().split('T')[0],
        feedback: item.feedback,
        category: item.category,
        subcategory: item.sub_category,
        sentiment: item.sentiment,
        sentiment_score: item.sentiment_score
      })) as Feedback[];
    }
  });
  
  // Filter data based on current filter settings
  const filteredData = feedbackData ? feedbackData.filter(item => {
    if (filter.channel && filter.channel !== 'all' && item.channel !== filter.channel) return false;
    if (filter.rating > 0 && item.rating !== filter.rating) return false;
    
    if (filter.year && filter.year !== 'all' || filter.month && filter.month !== 'all') {
      const date = new Date(item.submitDate);
      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 1).toString();
      
      if (filter.year && filter.year !== 'all' && year !== filter.year) return false;
      if (filter.month && filter.month !== 'all' && month !== filter.month) return false;
    }
    
    return true;
  }) : [];
  
  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your data is being prepared for export.",
    });
  };
  
  const handleCategoryChange = async (feedbackId: string, category: string, subcategory: string) => {
    try {
      // Update the category and subcategory in Supabase
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
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading feedback data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        <h2 className="text-xl font-bold mb-2">Error loading data</h2>
        <p>{(error as Error).message}</p>
      </div>
    );
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
      
      <FeedbackFilters filter={filter} setFilter={setFilter} />
      
      <Card>
        <CardContent className="pt-6">
          <FeedbackTable
            data={filteredData}
            categories={mockCategories}
            subcategories={mockSubcategories}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            openTagDialog={openTagDialog}
          />
        </CardContent>
      </Card>
      
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
