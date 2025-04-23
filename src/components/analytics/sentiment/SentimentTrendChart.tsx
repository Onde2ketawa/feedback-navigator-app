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

export const SentimentTrendChart: React.FC<SentimentTrendChartProps> = ({ data }) => {
  const config = {
    positive: { color: '#10b981', label: 'Positive' },
    neutral: { color: '#facc15', label: 'Neutral' },
    negative: { color: '#f43f5e', label: 'Negative' }
  };

  const years = Array.from(new Set(data.map(d => d.year))).sort();
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const chartData = months.map(month => {
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
        <table className="min-w-full border text-xs">
          <thead>
            <tr className="bg-muted">
              <th className="border px-2 py-1">Month</th>
              <th className="border px-2 py-1">Year</th>
              <th className="border px-2 py-1 text-green-700">Positive</th>
              <th className="border px-2 py-1 text-yellow-700">Neutral</th>
              <th className="border px-2 py-1 text-red-700">Negative</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, idx) => (
              <tr key={idx} className={idx % 2 === 1 ? "bg-muted/30" : ""}>
                <td className="border px-2 py-1">{d.month}</td>
                <td className="border px-2 py-1">{d.year}</td>
                <td className="border px-2 py-1 text-green-700">{d.positive}</td>
                <td className="border px-2 py-1 text-yellow-700">{d.neutral}</td>
                <td className="border px-2 py-1 text-red-700">{d.negative}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
