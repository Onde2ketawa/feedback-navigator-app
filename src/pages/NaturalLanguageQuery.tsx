import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, BarChart, PieChart, LineChart, Table, Search, History, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PieChart as RechartsPieChart, Cell, Pie, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart as RechartsLineChart, Line, ResponsiveContainer } from 'recharts';

interface QueryHistory {
  id: string;
  query: string;
  timestamp: Date;
  resultType: string;
}

interface ParsedQuery {
  chartType: 'pie' | 'bar' | 'line' | 'table' | 'grid';
  xAxis?: string;
  yAxis?: string;
  data: any[];
  title: string;
  filters?: {
    channel?: string;
    sentiment?: string;
    rating?: { min: number; max: number };
    timeframe?: string;
  };
}

const COLORS = ['#8b5cf6', '#6366f1', '#ec4899', '#f43f5e', '#f97316', '#14b8a6', '#10b981', '#a3e635'];

const NaturalLanguageQuery = () => {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedResult, setParsedResult] = useState<ParsedQuery | null>(null);
  const [queryHistory, setQueryHistory] = useState<QueryHistory[]>([
    {
      id: '1',
      query: 'Show feedback by channel as a pie chart',
      timestamp: new Date(Date.now() - 86400000),
      resultType: 'pie chart'
    },
    {
      id: '2',
      query: 'Display average rating by sentiment in table format',
      timestamp: new Date(Date.now() - 172800000),
      resultType: 'table'
    }
  ]);
  
  const { toast } = useToast();

  // Fetch feedback data
  const { data: feedbackData } = useQuery({
    queryKey: ['feedback-for-nlq'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customer_feedback')
        .select(`
          *,
          channel:channel_id(name)
        `);
      
      if (error) throw error;
      return data;
    }
  });

  const sampleQueries = [
    "Show feedback by channel as a pie chart",
    "Display average rating by sentiment in table format",
    "Create a line chart of feedback over time",
    "Show rating distribution as a bar chart",
    "Display sentiment breakdown in a table",
    "Show feedback count by device type"
  ];

  const generateVisualizationData = (queryType: string, feedbackData: any[]) => {
    if (!feedbackData) return [];

    if (queryType.includes('channel')) {
      const channelCounts: Record<string, number> = {};
      feedbackData.forEach(item => {
        const channelName = item.channel?.name || 'Unknown';
        channelCounts[channelName] = (channelCounts[channelName] || 0) + 1;
      });
      return Object.entries(channelCounts).map(([name, value]) => ({ name, value }));
    }

    if (queryType.includes('sentiment')) {
      if (queryType.includes('rating')) {
        const sentimentRatings: Record<string, { total: number; count: number }> = {};
        feedbackData.forEach(item => {
          const sentiment = item.sentiment || 'neutral';
          if (!sentimentRatings[sentiment]) {
            sentimentRatings[sentiment] = { total: 0, count: 0 };
          }
          sentimentRatings[sentiment].total += item.rating || 0;
          sentimentRatings[sentiment].count += 1;
        });
        return Object.entries(sentimentRatings).map(([sentiment, data]) => ({
          sentiment,
          average_rating: data.count > 0 ? (data.total / data.count).toFixed(2) : '0'
        }));
      } else {
        const sentimentCounts: Record<string, number> = {};
        feedbackData.forEach(item => {
          const sentiment = item.sentiment || 'neutral';
          sentimentCounts[sentiment] = (sentimentCounts[sentiment] || 0) + 1;
        });
        return Object.entries(sentimentCounts).map(([name, value]) => ({ name, value }));
      }
    }

    if (queryType.includes('rating') && queryType.includes('distribution')) {
      const ratingCounts: Record<number, number> = {};
      feedbackData.forEach(item => {
        const rating = item.rating || 0;
        ratingCounts[rating] = (ratingCounts[rating] || 0) + 1;
      });
      return Object.entries(ratingCounts).map(([rating, count]) => ({ 
        rating: `${rating} stars`, 
        count 
      }));
    }

    if (queryType.includes('time') || queryType.includes('over time')) {
      const monthCounts: Record<string, number> = {};
      feedbackData.forEach(item => {
        if (item.submit_date) {
          const month = new Date(item.submit_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          monthCounts[month] = (monthCounts[month] || 0) + 1;
        }
      });
      return Object.entries(monthCounts).map(([month, count]) => ({ month, count }));
    }

    if (queryType.includes('device')) {
      const deviceCounts: Record<string, number> = {};
      feedbackData.forEach(item => {
        const device = item.device || 'Unknown';
        deviceCounts[device] = (deviceCounts[device] || 0) + 1;
      });
      return Object.entries(deviceCounts).map(([name, value]) => ({ name, value }));
    }

    // Default fallback
    return [];
  };

  const parseQuery = async (userInput: string): Promise<ParsedQuery> => {
    setIsProcessing(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (!feedbackData) {
      throw new Error('No data available');
    }

    let result: ParsedQuery;
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('pie chart') || lowerInput.includes('pie')) {
      const data = generateVisualizationData(lowerInput, feedbackData);
      result = {
        chartType: 'pie',
        data,
        title: 'Data Distribution'
      };
    } else if (lowerInput.includes('table')) {
      const data = generateVisualizationData(lowerInput, feedbackData);
      result = {
        chartType: 'table',
        data,
        title: 'Data Table'
      };
    } else if (lowerInput.includes('line chart') || lowerInput.includes('over time')) {
      const data = generateVisualizationData(lowerInput, feedbackData);
      result = {
        chartType: 'line',
        xAxis: 'month',
        yAxis: 'count',
        data,
        title: 'Trend Over Time'
      };
    } else {
      const data = generateVisualizationData(lowerInput, feedbackData);
      result = {
        chartType: 'bar',
        xAxis: 'category',
        yAxis: 'count',
        data,
        title: 'Data Distribution'
      };
    }
    
    setIsProcessing(false);
    return result;
  };

  const handleSubmitQuery = async () => {
    if (!query.trim()) {
      toast({
        title: "Error",
        description: "Please enter a query",
        variant: "destructive"
      });
      return;
    }

    if (!feedbackData) {
      toast({
        title: "Error",
        description: "No data available to query",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await parseQuery(query);
      setParsedResult(result);
      
      // Add to history
      const newHistoryItem: QueryHistory = {
        id: Date.now().toString(),
        query,
        timestamp: new Date(),
        resultType: result.chartType
      };
      setQueryHistory(prev => [newHistoryItem, ...prev]);
      
      toast({
        title: "Query Processed",
        description: "Your data visualization has been generated successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your query. Please try again.",
        variant: "destructive"
      });
    }
  };

  const renderVisualization = () => {
    if (!parsedResult || !parsedResult.data.length) return (
      <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
        <p className="text-muted-foreground">No data to display</p>
      </div>
    );

    switch (parsedResult.chartType) {
      case 'pie':
        return (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={parsedResult.data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {parsedResult.data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        );
      
      case 'table':
        return (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  {Object.keys(parsedResult.data[0] || {}).map(key => (
                    <th key={key} className="px-4 py-2 text-left capitalize font-medium">
                      {key.replace('_', ' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {parsedResult.data.map((row, index) => (
                  <tr key={index} className="border-t">
                    {Object.values(row).map((value, idx) => (
                      <td key={idx} className="px-4 py-2">
                        {typeof value === 'number' ? value.toLocaleString() : String(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      
      case 'line':
        return (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={parsedResult.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={parsedResult.xAxis || Object.keys(parsedResult.data[0])[0]} />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey={parsedResult.yAxis || Object.keys(parsedResult.data[0])[1]} 
                  stroke="#8884d8" 
                  strokeWidth={2}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        );
      
      default:
        return (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={parsedResult.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={Object.keys(parsedResult.data[0])[0]} />
                <YAxis />
                <Tooltip />
                <Bar dataKey={Object.keys(parsedResult.data[0])[1]} fill="#8884d8" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader 
        title="Natural Language Query"
        description="Ask questions about your data in plain English and get instant visualizations"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Query Input Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Ask Your Question
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Textarea
                  placeholder="Type your question here... e.g., 'Show feedback by channel as a pie chart'"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleSubmitQuery}
                  disabled={isProcessing || !query.trim() || !feedbackData}
                  className="flex items-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  {isProcessing ? 'Processing...' : 'Generate Visualization'}
                </Button>
                
                {parsedResult && (
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                )}
              </div>
              
              {/* Sample Queries */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Try these sample queries:</p>
                <div className="flex flex-wrap gap-2">
                  {sampleQueries.slice(0, 3).map((sample, index) => (
                    <Badge 
                      key={index}
                      variant="outline" 
                      className="cursor-pointer hover:bg-muted"
                      onClick={() => setQuery(sample)}
                    >
                      {sample}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          {parsedResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  {parsedResult.title}
                  <Badge variant="secondary">{parsedResult.chartType}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="visualization" className="w-full">
                  <TabsList>
                    <TabsTrigger value="visualization">Visualization</TabsTrigger>
                    <TabsTrigger value="data">Raw Data</TabsTrigger>
                    <TabsTrigger value="customize">Customize</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="visualization" className="mt-4">
                    {renderVisualization()}
                  </TabsContent>
                  
                  <TabsContent value="data" className="mt-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <pre className="text-sm overflow-auto">
                        {JSON.stringify(parsedResult.data, null, 2)}
                      </pre>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="customize" className="mt-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Chart Type</label>
                          <select className="w-full mt-1 p-2 border rounded-md">
                            <option value="pie">Pie Chart</option>
                            <option value="bar">Bar Chart</option>
                            <option value="line">Line Chart</option>
                            <option value="table">Table</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Color Scheme</label>
                          <select className="w-full mt-1 p-2 border rounded-md">
                            <option value="default">Default</option>
                            <option value="blue">Blue Theme</option>
                            <option value="green">Green Theme</option>
                            <option value="purple">Purple Theme</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Query History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Query History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {queryHistory.map((item) => (
                  <div 
                    key={item.id}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-muted"
                    onClick={() => setQuery(item.query)}
                  >
                    <p className="text-sm font-medium line-clamp-2">{item.query}</p>
                    <div className="flex items-center justify-between mt-1">
                      <Badge variant="outline" className="text-xs">
                        {item.resultType}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {item.timestamp.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Help & Examples */}
          <Card>
            <CardHeader>
              <CardTitle>How to Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <p><strong>Chart Types:</strong> pie, bar, line, table</p>
                <p><strong>Data Sources:</strong> feedback, channels, sentiment, ratings</p>
                <p><strong>Time Periods:</strong> over time, by month, trends</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">More Examples:</p>
                {sampleQueries.slice(3).map((sample, index) => (
                  <Badge 
                    key={index}
                    variant="outline" 
                    className="block w-full text-left cursor-pointer hover:bg-muted p-2 h-auto"
                    onClick={() => setQuery(sample)}
                  >
                    {sample}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NaturalLanguageQuery;

}
