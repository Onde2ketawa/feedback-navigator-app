
import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

// Mock data
const COLORS = ['#8b5cf6', '#6366f1', '#ec4899', '#f43f5e', '#f97316', '#14b8a6', '#10b981', '#a3e635'];

const categoryData = [
  { name: 'Technical Issues', value: 35, color: COLORS[0] },
  { name: 'Customer Service', value: 25, color: COLORS[1] },
  { name: 'Product Features', value: 20, color: COLORS[2] },
  { name: 'Usability', value: 15, color: COLORS[3] },
  { name: 'Others', value: 5, color: COLORS[4] },
];

const subcategoryData = [
  { name: 'Login Problems', value: 15, color: COLORS[0] },
  { name: 'App Crashes', value: 10, color: COLORS[1] },
  { name: 'Slow Performance', value: 10, color: COLORS[2] },
];

const lineRatingByCategory = [
  { name: 'Technical Issues', rating: 3.2 },
  { name: 'Customer Service', rating: 4.1 },
  { name: 'Product Features', rating: 3.8 },
  { name: 'Usability', rating: 3.5 },
  { name: 'Others', rating: 3.9 },
];

const myHanaRatingByCategory = [
  { name: 'Technical Issues', rating: 3.5 },
  { name: 'Customer Service', rating: 4.3 },
  { name: 'Product Features', rating: 4.0 },
  { name: 'Usability', rating: 3.7 },
  { name: 'Others', rating: 4.1 },
];

const CategoryAnalytics: React.FC = () => {
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Filter data based on selected category
  const filteredSubcategoryData = selectedCategory === 'Technical Issues' 
    ? subcategoryData 
    : [];

  // Get category ratings based on selected channel
  const categoryRatings = selectedChannel === 'LINE Bank' 
    ? lineRatingByCategory 
    : selectedChannel === 'MyHana' 
    ? myHanaRatingByCategory 
    : lineRatingByCategory.map((item, index) => ({
        name: item.name,
        rating: (item.rating + myHanaRatingByCategory[index].rating) / 2,
      }));

  // Custom tooltip for the pie chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
          <p className="font-medium">{`${payload[0].name}: ${payload[0].value}`}</p>
          <p className="text-muted-foreground text-sm">{`${Math.round(payload[0].percent * 100)}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Category Analytics" 
        description="Analyze feedback by category and subcategory"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-sm font-medium block mb-2">Channel</label>
          <Select value={selectedChannel} onValueChange={setSelectedChannel}>
            <SelectTrigger>
              <SelectValue placeholder="Select channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Channels</SelectItem>
              <SelectItem value="LINE Bank">LINE Bank</SelectItem>
              <SelectItem value="MyHana">MyHana</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium block mb-2">Year</label>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
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
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
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
        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>
              Distribution of feedback by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    onClick={(data) => setSelectedCategory(data.name)}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        stroke={entry.name === selectedCategory ? '#000' : undefined}
                        strokeWidth={entry.name === selectedCategory ? 2 : 0}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {selectedCategory && (
              <p className="text-center mt-4 text-sm text-muted-foreground">
                Click on a category to view its subcategories
              </p>
            )}
          </CardContent>
        </Card>

        {/* Subcategory Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedCategory ? `${selectedCategory} Subcategories` : 'Subcategory Distribution'}
            </CardTitle>
            <CardDescription>
              {selectedCategory 
                ? `Distribution of feedback within ${selectedCategory} category`
                : 'Select a category to view subcategory breakdown'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {selectedCategory ? (
                  filteredSubcategoryData.length > 0 ? (
                    <PieChart>
                      <Pie
                        data={filteredSubcategoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {filteredSubcategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-muted-foreground">No subcategory data available</p>
                    </div>
                  )
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-muted-foreground">Select a category to view subcategory data</p>
                  </div>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Average Rating by Category */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Average Rating by Category</CardTitle>
            <CardDescription>
              Compare average ratings across different categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryRatings}
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
                  <Bar dataKey="rating" fill="#8b5cf6" name="Average Rating" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CategoryAnalytics;
