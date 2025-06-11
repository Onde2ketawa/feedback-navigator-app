
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart } from 'lucide-react';
import { PieChart as RechartsPieChart, Cell, Pie, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart as RechartsLineChart, Line, ResponsiveContainer } from 'recharts';

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

interface QueryVisualizationProps {
  parsedResult: ParsedQuery;
}

const COLORS = ['#8b5cf6', '#6366f1', '#ec4899', '#f43f5e', '#f97316', '#14b8a6', '#10b981', '#a3e635'];

export const QueryVisualization: React.FC<QueryVisualizationProps> = ({ parsedResult }) => {
  console.log('QueryVisualization received data:', parsedResult);

  const renderVisualization = () => {
    if (!parsedResult || !parsedResult.data || parsedResult.data.length === 0) {
      console.log('No data to display in visualization');
      return (
        <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
          <div className="text-center">
            <p className="text-muted-foreground">No data to display</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try a different query or check if data exists for the specified criteria
            </p>
          </div>
        </div>
      );
    }

    const data = parsedResult.data;
    console.log('Rendering chart type:', parsedResult.chartType, 'with data:', data);

    switch (parsedResult.chartType) {
      case 'pie':
        // Use 'value' or 'count' field for pie charts
        const pieDataKey = data[0]?.value !== undefined ? 'value' : 'count';
        return (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey={pieDataKey}
                >
                  {data.map((entry, index) => (
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
                  {Object.keys(data[0] || {}).map(key => (
                    <th key={key} className="px-4 py-2 text-left capitalize font-medium">
                      {key.replace('_', ' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
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
        const lineXKey = parsedResult.xAxis || Object.keys(data[0])[0];
        const lineYKey = parsedResult.yAxis || Object.keys(data[0])[1];
        return (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={lineXKey} />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey={lineYKey} 
                  stroke="#8884d8" 
                  strokeWidth={2}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        );
      
      default: // bar chart
        // Use 'count' or 'value' field for bar charts
        const barDataKey = data[0]?.count !== undefined ? 'count' : 
                          data[0]?.value !== undefined ? 'value' : 
                          Object.keys(data[0])[1];
        const xAxisKey = data[0]?.name !== undefined ? 'name' : Object.keys(data[0])[0];
        
        return (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xAxisKey} />
                <YAxis />
                <Tooltip />
                <Bar dataKey={barDataKey} fill="#8884d8" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        );
    }
  };

  return (
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
  );
};
