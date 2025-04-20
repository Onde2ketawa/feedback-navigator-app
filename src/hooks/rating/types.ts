// Define interfaces for the data structures
export interface YoyTrendDataPoint {
  name: string;
  [key: string]: number | string; // Allow dynamic year keys
}

export interface RatingDistributionDataPoint {
  rating: string;
  count: number;
  color: string;
}

export interface MonthlyRatingDataPoint {
  day: number;
  rating: number;
}

export interface CategoryRatingDataPoint {
  name: string;
  rating: number;
}

export interface FilterState {
  channelFilter: string;
  yearFilter: string;
  monthFilter: string;
}
