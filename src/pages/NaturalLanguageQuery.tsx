
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
}

const NaturalLanguageQuery = () => {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedResult, setParsedResult] = useState<ParsedQuery | null>(null);
  const [queryHistory, setQueryHistory] = useState<QueryHistory[]>([
    {
      id: '1',
      query: 'Show sales by region last quarter as a pie chart',
      timestamp: new Date(Date.now() - 86400000),
      resultType: 'pie chart'
    },
    {
      id: '2',
      query: 'Display top 10 products by revenue in table format',
      timestamp: new Date(Date.now() - 172800000),
      resultType: 'table'
    }
  ]);
  
  const { toast } = useToast();

  const sampleQueries = [
    "Show sales by region last quarter as a pie chart",
    "Display top 10 products by revenue in table format",
    "Create a line chart of monthly user growth",
    "Show feedback ratings distribution as a bar chart",
    "Display category breakdown in a table",
    "Show sentiment analysis over time"
  ];

  const parseQuery = async (userInput: string): Promise<ParsedQuery> => {
    // Mock AI parsing - in real implementation, this would call OpenAI/Hugging Face
    setIsProcessing(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock response based on keywords
    let result: ParsedQuery;
    
    if (userInput.toLowerCase().includes('pie chart') || userInput.toLowerCase().includes('pie')) {
      result = {
        chartType: 'pie',
        data: [
          { name: 'North', value: 400 },
          { name: 'South', value: 300 },
          { name: 'East', value: 300 },
          { name: 'West', value: 200 }
        ],
        title: 'Sales by Region'
      };
    } else if (userInput.toLowerCase().includes('table') || userInput.toLowerCase().includes('top')) {
      result = {
        chartType: 'table',
        data: [
          { product: 'Product A', revenue: 15000 },
          { product: 'Product B', revenue: 12000 },
          { product: 'Product C', revenue: 10000 },
          { product: 'Product D', revenue: 8000 },
          { product: 'Product E', revenue: 6000 }
        ],
        title: 'Top Products by Revenue'
      };
    } else if (userInput.toLowerCase().includes('line chart') || userInput.toLowerCase().includes('over time')) {
      result = {
        chartType: 'line',
        xAxis: 'month',
        yAxis: 'users',
        data: [
          { month: 'Jan', users: 400 },
          { month: 'Feb', users: 300 },
          { month: 'Mar', users: 500 },
          { month: 'Apr', users: 700 },
          { month: 'May', users: 600 }
        ],
        title: 'User Growth Over Time'
      };
    } else {
      result = {
        chartType: 'bar',
        xAxis: 'category',
        yAxis: 'count',
        data: [
          { category: 'Category A', count: 40 },
          { category: 'Category B', count: 30 },
          { category: 'Category C', count: 50 },
          { category: 'Category D', count: 25 }
        ],
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
    if (!parsedResult) return null;

    switch (parsedResult.chartType) {
      case 'pie':
        return (
          <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
            <div className="text-center">
              <PieChart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Pie Chart Visualization</p>
              <p className="text-xs text-muted-foreground mt-2">
                {parsedResult.data.length} data points
              </p>
            </div>
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
                      {key}
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
          <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
            <div className="text-center">
              <LineChart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Line Chart Visualization</p>
              <p className="text-xs text-muted-foreground mt-2">
                {parsedResult.xAxis} vs {parsedResult.yAxis}
              </p>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
            <div className="text-center">
              <BarChart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Bar Chart Visualization</p>
              <p className="text-xs text-muted-foreground mt-2">
                {parsedResult.data.length} data points
              </p>
            </div>
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
                  placeholder="Type your question here... e.g., 'Show sales by region last quarter as a pie chart'"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleSubmitQuery}
                  disabled={isProcessing || !query.trim()}
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
                <p><strong>Time Periods:</strong> last quarter, this year, last month</p>
                <p><strong>Aggregations:</strong> top 10, by region, total count</p>
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
