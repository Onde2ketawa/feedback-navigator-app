
import React from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FilterControls } from '@/components/analytics/FilterControls';
import { CategoryPieChart } from '@/components/analytics/category/CategoryPieChart';
import { SubcategoryPieChart } from '@/components/analytics/category/SubcategoryPieChart';
import { CategoryRatingBarChart } from '@/components/analytics/category/CategoryRatingBarChart';
import { CategoryTrendChart } from '@/components/analytics/category/CategoryTrendChart';
import { RatingFilter } from '@/components/dashboard/filters/RatingFilter';
import { useCategoryAnalyticsData } from '@/hooks/category/useCategoryAnalyticsData';
import { Skeleton } from '@/components/ui/skeleton';

const CategoryAnalytics: React.FC = () => {
  const {
    isLoading,
    categoryData,
    subcategoryData,
    availableCategories,
    categoryRatings,
    categoryTrendData,
    selectedTrendCategories,
    ratingRange,
    selectedChannel,
    setSelectedChannel,
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    selectedCategory,
    setSelectedCategory,
    setRatingRange,
    toggleCategory,
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
            {isLoading ? (
              <div className="h-80 flex items-center justify-center">
                <Skeleton className="h-4/5 w-4/5 rounded-full" />
              </div>
            ) : categoryData.length > 0 ? (
              <CategoryPieChart 
                data={categoryData} 
                selectedCategory={selectedCategory}
                onCategorySelect={setSelectedCategory}
              />
            ) : (
              <div className="h-80 flex items-center justify-center">
                <p className="text-muted-foreground">No category data available</p>
              </div>
            )}
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
            {isLoading ? (
              <div className="h-80 flex items-center justify-center">
                <Skeleton className="h-4/5 w-4/5 rounded-full" />
              </div>
            ) : (
              <SubcategoryPieChart
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                availableCategories={availableCategories}
                subcategoryData={subcategoryData}
              />
            )}
          </CardContent>
        </Card>

        {/* Category Trend */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Category Trend</CardTitle>
            <CardDescription>
              Monthly category trends with rating filter
            </CardDescription>
            <div className="flex items-center gap-4 mt-4">
              <div className="w-64">
                <RatingFilter 
                  ratingRange={ratingRange}
                  onRatingChange={setRatingRange}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-80 flex items-center justify-center">
                <Skeleton className="h-4/5 w-full" />
              </div>
            ) : (
              <CategoryTrendChart
                data={categoryTrendData}
                selectedCategories={selectedTrendCategories}
                onCategoryToggle={toggleCategory}
                availableCategories={availableCategories}
              />
            )}
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
            {isLoading ? (
              <div className="h-80 flex items-center justify-center">
                <Skeleton className="h-4/5 w-full" />
              </div>
            ) : categoryRatings.length > 0 ? (
              <CategoryRatingBarChart categoryRatings={categoryRatings} />
            ) : (
              <div className="h-80 flex items-center justify-center">
                <p className="text-muted-foreground">No rating data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CategoryAnalytics;
