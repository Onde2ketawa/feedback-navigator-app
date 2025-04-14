
import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { FeedbackTable } from '@/components/dashboard/FeedbackTable';
import { BulkActionButtons } from '@/components/dashboard/BulkActionButtons';
import { FeedbackFilters } from '@/components/dashboard/FeedbackFilters';
import { FeedbackCategoryDialog } from '@/components/dashboard/FeedbackCategoryDialog';
import { Feedback, generateMockData, mockCategories, mockSubcategories } from '@/models/feedback';

const mockData = generateMockData();

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
  
  // Filter data based on current filter settings
  const filteredData = mockData.filter(item => {
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
  });
  
  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your data is being prepared for export.",
    });
  };
  
  const handleCategoryChange = (feedbackId: string, category: string, subcategory: string) => {
    // In a real app, you would update the database here
    toast({
      title: "Categories Updated",
      description: "Feedback categories have been updated successfully.",
    });
    setIsDialogOpen(false);
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
