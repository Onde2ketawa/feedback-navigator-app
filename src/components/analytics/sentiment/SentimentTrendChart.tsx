
import React, { useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { getMonthIdx } from '@/hooks/sentiment/sentimentMonthUtils';

interface SentimentTrendMonthYearPoint {
  month: string;
  year: string;
  positive: number;
  neutral: number;
  negative: number;
}

interface SentimentTrendChartProps {
  data: SentimentTrendMonthYearPoint[];
}

export const SentimentTrendChart: React.FC<SentimentTrendChartProps> = ({ data = [] }) => {
  const config = {
    positive: { color: '#10b981', label: 'Positive' },
    neutral: { color: '#facc15', label: 'Neutral' },
    negative: { color: '#f43f5e', label: 'Negative' }
  };

  useEffect(() => {
    console.log('SentimentTrendChart received data:', data.length, 'data points');
    if (data.length > 0) {
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
  
  const years = Array.from(new Set(data.map(d => d.year))).sort();
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
        base[`${year}_positive`] = entry.positive;
        base[`${year}_neutral`] = entry.neutral;
        base[`${year}_negative`] = entry.negative;
      } else {
        base[`${year}_positive`] = 0;
        base[`${year}_neutral`] = 0;
        base[`${year}_negative`] = 0;
      }
    });
    return base;
  });
  
  console.log('Chart data prepared with', chartData.length, 'entries');

  if (data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-muted-foreground">
        No sentiment trend data available
      </div>
    );
  }

  const dataWithTotals = data.map(d => {
    const total = d.positive + d.neutral + d.negative;
    const positivePercentage = total > 0 ? ((d.positive / total) * 100).toFixed(1) : "0.0";
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
      <ChartContainer config={config} className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            {years.map(year => (
              <React.Fragment key={year}>
                <Line
                  type="monotone"
                  dataKey={`${year}_positive`}
                  stroke="#10b981"
                  strokeWidth={2}
                  name={`${year} Positive`}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey={`${year}_neutral`}
                  stroke="#facc15"
                  strokeWidth={2}
                  name={`${year} Neutral`}
                />
                <Line
                  type="monotone"
                  dataKey={`${year}_negative`}
                  stroke="#f43f5e"
                  strokeWidth={2}
                  name={`${year} Negative`}
                />
              </React.Fragment>
            ))}
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      <div className="overflow-x-auto mt-6">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Month</TableHead>
              <TableHead>Year</TableHead>
              <TableHead className="text-green-700">Positive</TableHead>
              <TableHead className="text-yellow-700">Neutral</TableHead>
              <TableHead className="text-red-700">Negative</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Positive %</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTableData.map((d, idx) => (
              <TableRow key={`${d.year}-${d.month}`} className={idx % 2 === 1 ? "bg-muted/30" : ""}>
                <TableCell>{d.month}</TableCell>
                <TableCell>{d.year}</TableCell>
                <TableCell className="text-green-700">{d.positive}</TableCell>
                <TableCell className="text-yellow-700">{d.neutral}</TableCell>
                <TableCell className="text-red-700">{d.negative}</TableCell>
                <TableCell>{d.total}</TableCell>
                <TableCell>{d.positivePercentage}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
