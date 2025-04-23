
import React, { useEffect } from 'react';
import { SentimentTrendLineChart } from './SentimentTrendLineChart';
import { SentimentTrendTable } from './SentimentTrendTable';
import { getMonthIdx } from '@/hooks/sentiment/sentimentMonthUtils';

interface SentimentTrendMonthYearPoint {
  month: string;
  year: string;
  positive: number;
  neutral: number;
  negative: number;
}

interface SentimentTrendChartProps {
  data?: SentimentTrendMonthYearPoint[];
}

export const SentimentTrendChart = ({ data = [] }: SentimentTrendChartProps) => {
  const config = {
    positive: { color: '#10b981', label: 'Positive' },
    neutral: { color: '#facc15', label: 'Neutral' },
    negative: { color: '#f43f5e', label: 'Negative' }
  };

  useEffect(() => {
    console.log('SentimentTrendChart received data:', data?.length || 0, 'data points');
    if (data && data.length > 0) {
      console.log('First data point:', data[0]);
      console.log('Last data point:', data[data.length - 1]);
      
      const uniqueYears = [...new Set(data.map(d => d.year))].sort();
      console.log('Unique years in chart data:', uniqueYears);
      
      const monthsPerYear: Record<string, string[]> = {};
      uniqueYears.forEach(year => {
        monthsPerYear[year] = [...new Set(data.filter(d => d.year === year).map(d => d.month))];
      });
      console.log('Months per year:', monthsPerYear);
    }
  }, [data]);

  // Check if we actually have data with sentiment values
  const hasData = data && data.length > 0 && 
    data.some(d => d.positive > 0 || d.neutral > 0 || d.negative > 0);

  if (!hasData) {
    return (
      <div className="h-80 flex items-center justify-center text-muted-foreground">
        No sentiment trend data available
      </div>
    );
  }

  const years = [...new Set(data.map(d => d.year))].sort();
  console.log('Years in data:', years);

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

  console.log('Chart data prepared with', chartData.length, 'entries');

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

  return (
    <div>
      <SentimentTrendLineChart
        chartData={chartData}
        years={years}
        config={config}
      />
      <SentimentTrendTable tableData={sortedTableData} />
    </div>
  );
};
