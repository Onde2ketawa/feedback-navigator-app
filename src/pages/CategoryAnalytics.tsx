
import React from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FilterControls } from '@/components/analytics/FilterControls';
import { CategoryPieChart } from '@/components/analytics/category/CategoryPieChart';
import { SubcategoryPieChart } from '@/components/analytics/category/SubcategoryPieChart';
import { CategoryRatingBarChart } from '@/components/analytics/category/CategoryRatingBarChart';
import { useCategoryAnalyticsData } from '@/hooks/category/useCategoryAnalyticsData';

const CategoryAnalytics: React.FC = () => {
  const {
    categoryData,
    subcategoryData,
    availableCategories,
    categoryRatings,
    selectedChannel,
    setSelectedChannel,
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    selectedCategory,
    setSelectedCategory,
  } = useCategoryAnalyticsData();

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Category Analytics" 
        description="Analyze feedback by category and subcategory"
      />

      <FilterControls
        channelFilter={selectedChannel}
        setChannelFilter={setSelectedChannel}
        yearFilter={selectedYear}
        setYearFilter={setSelectedYear}
        monthFilter={selectedMonth}
        setMonthFilter={setSelectedMonth}
      />

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
            <CategoryPieChart 
              data={categoryData} 
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />
            <p className="text-center mt-4 text-sm text-muted-foreground">
              Click on a category to view its subcategories
            </p>
          </CardContent>
        </Card>

        {/* Subcategory Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>
              Subcategory Distribution
            </CardTitle>
            <CardDescription>
              Distribution of feedback within selected category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SubcategoryPieChart
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              availableCategories={availableCategories}
              subcategoryData={subcategoryData}
            />
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
            <CategoryRatingBarChart categoryRatings={categoryRatings} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CategoryAnalytics;
