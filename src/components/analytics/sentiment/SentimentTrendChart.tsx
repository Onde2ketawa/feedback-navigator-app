
import React from 'react';
import { SentimentTrendChartSection } from './SentimentTrendChartSection';
import { SentimentTrendMonthYearPoint } from '@/hooks/sentiment/sentimentTrendTransform';

interface SentimentTrendChartProps {
  data?: SentimentTrendMonthYearPoint[];
}

export const SentimentTrendChart = ({ data = [] }: SentimentTrendChartProps) => (
  <SentimentTrendChartSection data={data} />
);

