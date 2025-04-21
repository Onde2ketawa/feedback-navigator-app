
import React from 'react';
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

// Update: Now data format is array of { month: string, year: string, positive, neutral, negative }
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

/**
 * The trend data is [{month, year, ...}] so we need to:
 * - group all data by year
 * - produce an array of objects: [{ month: "Jan", "2024_positive": n, "2024_neutral": ..., "2025_positive": ... }]
 *   But for a multi-year multiline chart, we'll plot each year's sentiment as a line.
 */
export const SentimentTrendChart: React.FC<SentimentTrendChartProps> = ({ data }) => {
  const config = {
    positive: { color: '#10b981', label: 'Positive' },
    neutral: { color: '#facc15', label: 'Neutral' },
    negative: { color: '#f43f5e', label: 'Negative' }
  };

  // Get list of present years in the data
  const years = Array.from(new Set(data.map(d => d.year))).sort();
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  // Transform: output array of objects per month, shape:
  // { month: "Jan", "2024_positive": n, "2024_neutral": ..., "2025_positive": ... }
  const chartData: Record<string, any>[] = months.map(month => {
    const base: Record<string, any> = { month };
    years.forEach(year => {
      const found = data.find(d => d.month === month && d.year === year);
      base[`${year}_positive`] = found ? found.positive : 0;
      base[`${year}_neutral`] = found ? found.neutral : 0;
      base[`${year}_negative`] = found ? found.negative : 0;
    });
    return base;
  });

  if (data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-muted-foreground">
        No sentiment trend data available
      </div>
    );
  }

  return (
    <ChartContainer config={config} className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          {/* Render a line for each year-sentiment pair */}
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
  );
};
