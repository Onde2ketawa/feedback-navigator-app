
import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const RatingAnalytics: React.FC = () => {
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('2024');
  const [monthFilter, setMonthFilter] = useState<string>('all');
  
  // Mock data for the year-over-year trend
  const yoyTrendData = [
    { name: 'Jan', LINE: 4.1, MyHana: 4.3 },
    { name: 'Feb', LINE: 4.2, MyHana: 4.1 },
    { name: 'Mar', LINE: 4.3, MyHana: 4.0 },
    { name: 'Apr', LINE: 4.0, MyHana: 4.2 },
    { name: 'May', LINE: 3.9, MyHana: 4.4 },
    { name: 'Jun', LINE: 3.8, MyHana: 4.3 },
    { name: 'Jul', LINE: 3.7, MyHana: 4.1 },
    { name: 'Aug', LINE: 3.9, MyHana: 4.2 },
    { name: 'Sep', LINE: 4.0, MyHana: 4.3 },
    { name: 'Oct', LINE: 4.1, MyHana: 4.4 },
    { name: 'Nov', LINE: 4.2, MyHana: 4.5 },
    { name: 'Dec', LINE: 4.3, MyHana: 4.4 },
  ];
  
  // Mock data for rating distribution
  const ratingDistributionData = [
    { rating: '1 Star', count: 24, color: '#f87171' },
    { rating: '2 Stars', count: 38, color: '#fb923c' },
    { rating: '3 Stars', count: 56, color: '#facc15' },
    { rating: '4 Stars', count: 89, color: '#a3e635' },
    { rating: '5 Stars', count: 120, color: '#4ade80' },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Rating Analytics" 
        description="Analyze rating trends and distributions over time"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-sm font-medium block mb-2">Channel</label>
          <Select value={channelFilter} onValueChange={setChannelFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Select channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Channels</SelectItem>
              <SelectItem value="LINE">LINE Bank</SelectItem>
              <SelectItem value="MyHana">MyHana</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium block mb-2">Year</label>
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium block mb-2">Month</label>
          <Select value={monthFilter} onValueChange={setMonthFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Select month" />
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* YoY Rating Trend */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Year-over-Year Rating Trend</CardTitle>
            <CardDescription>
              Average rating trends by month for {yearFilter}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={yoyTrendData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis
                    stroke="#64748b"
                    domain={[0, 5]}
                    ticks={[1, 2, 3, 4, 5]}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="LINE"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                    name="LINE Bank"
                    hide={channelFilter !== 'all' && channelFilter !== 'LINE'}
                  />
                  <Line
                    type="monotone"
                    dataKey="MyHana"
                    stroke="#6366f1"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                    name="MyHana"
                    hide={channelFilter !== 'all' && channelFilter !== 'MyHana'}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Monthly Rating Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Rating Trend</CardTitle>
            <CardDescription>
              Daily average ratings for selected month and channel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={Array.from({ length: 30 }, (_, i) => ({
                    day: i + 1,
                    rating: (3.5 + Math.random()).toFixed(1),
                  }))}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="day"
                    stroke="#64748b"
                    label={{ value: 'Day of Month', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis
                    stroke="#64748b"
                    domain={[0, 5]}
                    ticks={[1, 2, 3, 4, 5]}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="rating"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ r: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Rating Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
            <CardDescription>
              Distribution of ratings by count
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={ratingDistributionData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="rating" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Bar dataKey="count" name="Feedback Count">
                    {ratingDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RatingAnalytics;
