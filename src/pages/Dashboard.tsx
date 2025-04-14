
import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { FeedbackTable } from '@/components/dashboard/FeedbackTable';
import { BulkActionButtons } from '@/components/dashboard/BulkActionButtons';
import { FeedbackSortSection } from '@/components/dashboard/FeedbackSortSection';
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
    channel: null as string | null,
    rating: 0,
    year: null as string | null,
    month: null as string | null,
  });
  
  // Fetch feedback data from Supabase with dynamic filtering
  const { data: feedbackData, isLoading, error } = useQuery({
    queryKey: ['feedback', filter],
    queryFn: async () => {
      let query = supabase
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
      
      // Apply filters
      if (filter.channel) {
        query = query.eq('channel_id.name', filter.channel);
      }
      
      if (filter.year) {
        query = query.gte('submit_date', `${filter.year}-01-01`)
                     .lt('submit_date', `${parseInt(filter.year) + 1}-01-01`);
      }
      
      if (filter.month) {
        query = query.gte('submit_date', `${filter.year}-${filter.month.padStart(2, '0')}-01`)
                     .lt('submit_date', `${filter.year}-${(parseInt(filter.month) + 1).toString().padStart(2, '0')}-01`);
      }
      
      if (filter.rating > 0) {
        query = query.eq('rating', filter.rating);
      }
      
      const { data, error } = await query;
      
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
  
  const handleFilterChange = (filters: {
    channel: string | null;
    year: string | null;
    month: string | null;
    ratingMin: number;
    ratingMax: number;
  }) => {
    setFilter({
      channel: filters.channel,
      year: filters.year,
      month: filters.month,
      rating: filters.ratingMin // For simplicity, we'll use the min rating
    });
  };

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
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="md:col-span-1">
          <FeedbackSortSection onFilterChange={handleFilterChange} />
        </div>
        <div className="md:col-span-3">
          <Card>
            <CardContent className="pt-6">
              <FeedbackTable
                data={feedbackData || []}
                categories={mockCategories}
                subcategories={mockSubcategories}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                openTagDialog={openTagDialog}
              />
            </CardContent>
          </Card>
        </div>
      </div>
      
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
