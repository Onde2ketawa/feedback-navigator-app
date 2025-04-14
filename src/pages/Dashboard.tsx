
import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tag, Download, Filter, Search, MoreHorizontal, Star } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import CategorySelector from '@/components/CategorySelector';
import { useToast } from '@/hooks/use-toast';

// Mock data for table
interface Feedback {
  id: string;
  channel: string;
  rating: number;
  submitDate: string;
  feedback?: string;
  category?: string;
  subcategory?: string;
}

// Mock data for categories and subcategories
const mockCategories = [
  { id: 'cat1', name: 'Technical Issues' },
  { id: 'cat2', name: 'Customer Service' },
  { id: 'cat3', name: 'Product Features' },
  { id: 'cat4', name: 'Usability' },
];

const mockSubcategories = [
  { id: 'cat1-sub1', name: 'Login Problems' },
  { id: 'cat1-sub2', name: 'App Crashes' },
  { id: 'cat1-sub3', name: 'Slow Performance' },
  { id: 'cat2-sub1', name: 'Response Time' },
  { id: 'cat2-sub2', name: 'Staff Knowledge' },
  { id: 'cat3-sub1', name: 'Missing Features' },
  { id: 'cat3-sub2', name: 'Feature Requests' },
  { id: 'cat4-sub1', name: 'UI Design' },
  { id: 'cat4-sub2', name: 'Navigation' },
];

// Generate mock data
const generateMockData = (): Feedback[] => {
  return Array.from({ length: 50 }).map((_, i) => {
    const id = `feedback-${i + 1}`;
    const channels = ['LINE Bank', 'MyHana'];
    const channel = channels[Math.floor(Math.random() * channels.length)];
    const rating = Math.floor(Math.random() * 5) + 1;
    
    // Generate a date within the last 6 months
    const date = new Date();
    date.setMonth(date.getMonth() - Math.floor(Math.random() * 6));
    const submitDate = date.toISOString().split('T')[0];
    
    // Add categories to some items
    let category, subcategory;
    if (Math.random() > 0.4) {
      const catIndex = Math.floor(Math.random() * mockCategories.length);
      category = mockCategories[catIndex].id;
      
      const subcats = mockSubcategories.filter(sc => sc.id.startsWith(category));
      if (subcats.length && Math.random() > 0.3) {
        const subIndex = Math.floor(Math.random() * subcats.length);
        subcategory = subcats[subIndex].id;
      }
    }
    
    return {
      id,
      channel,
      rating,
      submitDate,
      feedback: Math.random() > 0.3 ? `Sample feedback text ${i + 1}` : undefined,
      category,
      subcategory,
    };
  });
};

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
    if (filter.channel && item.channel !== filter.channel) return false;
    if (filter.rating > 0 && item.rating !== filter.rating) return false;
    
    if (filter.year || filter.month) {
      const date = new Date(item.submitDate);
      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 1).toString();
      
      if (filter.year && year !== filter.year) return false;
      if (filter.month && month !== filter.month) return false;
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
    if (selectedRows.length === 0) {
      toast({
        title: "No rows selected",
        description: "Please select at least one row to tag.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Bulk Tagging",
      description: `${selectedRows.length} rows selected for tagging.`,
    });
  };

  // Column definitions
  const columns: ColumnDef<Feedback>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Input
          type="checkbox"
          className="h-4 w-4"
          checked={
            table.getFilteredRowModel().rows.length > 0 &&
            table.getIsAllRowsSelected()
          }
          onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
        />
      ),
      cell: ({ row }) => (
        <Input
          type="checkbox"
          className="h-4 w-4"
          checked={row.getIsSelected()}
          onChange={(e) => {
            row.toggleSelected(e.target.checked)
            
            // Update selected rows
            const id = row.original.id;
            if (e.target.checked) {
              setSelectedRows(prev => [...prev, id]);
            } else {
              setSelectedRows(prev => prev.filter(rowId => rowId !== id));
            }
          }}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "channel",
      header: "Channel",
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => {
        const rating = row.getValue("rating") as number;
        return (
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "submitDate",
      header: "Submit Date",
    },
    {
      accessorKey: "feedback",
      header: "Feedback",
      cell: ({ row }) => {
        const feedback = row.getValue("feedback") as string;
        return feedback ? (
          <div className="max-w-[300px] truncate">{feedback}</div>
        ) : (
          <span className="text-muted-foreground italic">No feedback</span>
        );
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const categoryId = row.getValue("category") as string | undefined;
        const subcategoryId = row.original.subcategory;
        
        if (!categoryId) {
          return <span className="text-muted-foreground italic">Uncategorized</span>;
        }
        
        const category = mockCategories.find(c => c.id === categoryId);
        const subcategory = subcategoryId 
          ? mockSubcategories.find(sc => sc.id === subcategoryId)
          : undefined;
          
        return (
          <div>
            <div className="font-medium">{category?.name || 'Unknown'}</div>
            {subcategory && <div className="text-sm text-muted-foreground">{subcategory.name}</div>}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const feedback = row.original;
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openTagDialog(feedback)}>
                <Tag className="mr-2 h-4 w-4" />
                <span>Edit Tags</span>
              </DropdownMenuItem>
              {/* Add more dropdown actions as needed */}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Review Dashboard" 
        description="Browse and manage feedback entries"
      >
        <Button onClick={handleBulkTag} className="flex items-center" variant="outline">
          <Tag className="mr-2 h-4 w-4" />
          <span>Bulk Tag</span>
        </Button>
        <Button onClick={handleExport} className="flex items-center">
          <Download className="mr-2 h-4 w-4" />
          <span>Export</span>
        </Button>
      </PageHeader>
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Filters</CardTitle>
          <CardDescription>Filter feedback by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Channel</label>
              <Select value={filter.channel} onValueChange={(value) => setFilter({...filter, channel: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="All Channels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Channels</SelectItem>
                  <SelectItem value="LINE Bank">LINE Bank</SelectItem>
                  <SelectItem value="MyHana">MyHana</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Rating</label>
              <Select 
                value={filter.rating.toString()} 
                onValueChange={(value) => setFilter({...filter, rating: parseInt(value) || 0})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Ratings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">All Ratings</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Year</label>
              <Select value={filter.year} onValueChange={(value) => setFilter({...filter, year: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="All Years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Month</label>
              <Select value={filter.month} onValueChange={(value) => setFilter({...filter, month: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="All Months" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Months</SelectItem>
                  <SelectItem value="1">January</SelectItem>
                  <SelectItem value="2">February</SelectItem>
                  <SelectItem value="3">March</SelectItem>
                  <SelectItem value="4">April</SelectItem>
                  <SelectItem value="5">May</SelectItem>
                  <SelectItem value="6">June</SelectItem>
                  <SelectItem value="7">July</SelectItem>
                  <SelectItem value="8">August</SelectItem>
                  <SelectItem value="9">September</SelectItem>
                  <SelectItem value="10">October</SelectItem>
                  <SelectItem value="11">November</SelectItem>
                  <SelectItem value="12">December</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <DataTable columns={columns} data={filteredData} />
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Category Tags</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {selectedFeedback && (
              <CategorySelector
                initialCategory={selectedFeedback.category}
                initialSubcategory={selectedFeedback.subcategory}
                onSave={(category, subcategory) => 
                  handleCategoryChange(selectedFeedback.id, category, subcategory)
                }
                categories={mockCategories}
                subcategories={mockSubcategories}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
