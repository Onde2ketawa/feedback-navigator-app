
import React, { useEffect, useState } from 'react';
import { SentimentTrendLineChart } from './SentimentTrendLineChart';
import { SentimentTrendBarChart } from './SentimentTrendBarChart';
import { SentimentTrendTable } from './SentimentTrendTable';
import { SentimentTrendMonthYearPoint } from '@/hooks/sentiment/sentimentTrendTransform';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { BarChart3, TrendingUp } from 'lucide-react';

interface SentimentTrendChartSectionProps {
  data: SentimentTrendMonthYearPoint[];
}

type ChartType = 'line' | 'bar';

export const SentimentTrendChartSection: React.FC<SentimentTrendChartSectionProps> = ({ data }) => {
  const [chartType, setChartType] = useState<ChartType>('line');
  
  const config = {
    positive: { color: '#10b981', label: 'Positive' },
    neutral: { color: '#facc15', label: 'Neutral' },
    negative: { color: '#f43f5e', label: 'Negative' }
  };

  useEffect(() => {
    console.log('[SentimentTrendChartSection] Received data:', data?.length || 0, 'data points');
    console.log('[SentimentTrendChartSection] Raw data:', data);
    
    if (data && data.length > 0) {
      console.log('[SentimentTrendChartSection] First data point:', data[0]);
      console.log('[SentimentTrendChartSection] Last data point:', data[data.length - 1]);
      
      const uniqueYears = [...new Set(data.map(d => d.year))].sort();
      console.log('[SentimentTrendChartSection] Unique years in chart data:', uniqueYears);
      
      const monthsPerYear: Record<string, string[]> = {};
      uniqueYears.forEach(year => {
        monthsPerYear[year] = [...new Set(data.filter(d => d.year === year).map(d => d.month))];
      });
      console.log('[SentimentTrendChartSection] Months per year:', monthsPerYear);
      
      // Check if data has actual sentiment counts
      const hasPositive = data.some(d => d.positive > 0);
      const hasNeutral = data.some(d => d.neutral > 0);
      const hasNegative = data.some(d => d.negative > 0);
      console.log('[SentimentTrendChartSection] Data has:', { hasPositive, hasNeutral, hasNegative });
      
      // Check total counts per data point
      data.forEach((point, index) => {
        const total = point.positive + point.neutral + point.negative;
        console.log(`[SentimentTrendChartSection] Data point ${index + 1} (${point.month} ${point.year}): P=${point.positive}, N=${point.neutral}, Neg=${point.negative}, Total=${total}`);
      });
    } else {
      console.log('[SentimentTrendChartSection] No data or empty array received');
    }
  }, [data]);

  const hasData = data && data.length > 0 &&
    data.some(d => d.positive > 0 || d.neutral > 0 || d.negative > 0);

  console.log('[SentimentTrendChartSection] Has valid data for rendering:', hasData);

  if (!hasData) {
    return (
      <div className="h-80 flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p className="text-lg font-medium">No sentiment trend data available</p>
          <p className="text-sm mt-2">Try selecting a different channel or check if there's data for the selected period.</p>
        </div>
      </div>
    );
  }

  const years = [...new Set(data.map(d => d.year))].sort();

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const chartData = months.map(month => {
    const base: Record<string, any> = { month };
    years.forEach(year => {
      const entriesForMonthYear = data.filter(d => d.month === month && d.year === year);
      if (entriesForMonthYear.length > 0) {
        const entry = entriesForMonthYear[0];
        base[`${year}_positive`] = Number(entry.positive) || 0;
        base[`${year}_neutral`] = Number(entry.neutral) || 0;
        base[`${year}_negative`] = Number(entry.negative) || 0;
      } else {
        base[`${year}_positive`] = 0;
        base[`${year}_neutral`] = 0;
        base[`${year}_negative`] = 0;
      }
    });
    return base;
  });

  const dataWithTotals = data.map(d => {
    const total = (Number(d.positive) || 0) + (Number(d.neutral) || 0) + (Number(d.negative) || 0);
    const positivePercentage = total > 0 ? ((Number(d.positive) / total) * 100).toFixed(1) : "0.0";
    return {
      ...d,
      total,
      positivePercentage
    };
  });

  const sortedTableData = [...dataWithTotals].sort((a, b) => {
    if (a.year !== b.year) {
      return parseInt(b.year) - parseInt(a.year);
    }
    const monthAIndex = months.indexOf(a.month);
    const monthBIndex = months.indexOf(b.month);
    return monthBIndex - monthAIndex;
  });

  console.log('[SentimentTrendChartSection] Final chart data:', chartData);
  console.log('[SentimentTrendChartSection] Final table data:', sortedTableData);

  return (
    <div className="space-y-4">
      {/* Chart Type Toggle */}
      <div className="flex justify-end">
        <ToggleGroup
          type="single"
          value={chartType}
          onValueChange={(value) => value && setChartType(value as ChartType)}
          className="border rounded-lg"
        >
          <ToggleGroupItem value="line" aria-label="Line Chart" className="px-3 py-2">
            <TrendingUp className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="bar" aria-label="Bar Chart" className="px-3 py-2">
            <BarChart3 className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Chart */}
      {chartType === 'line' ? (
        <SentimentTrendLineChart
          chartData={chartData}
          years={years}
          config={config}
        />
      ) : (
        <SentimentTrendBarChart
          chartData={chartData}
          years={years}
          config={config}
        />
      )}

      <SentimentTrendTable tableData={sortedTableData} />
    </div>
  );
};
