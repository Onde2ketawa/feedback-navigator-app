
// Define the data types
export interface CategoryDataItem {
  name: string;
  value: number;
  color: string;
}

export interface SubcategoryData {
  [key: string]: CategoryDataItem[];
}

export interface CategoryRating {
  name: string;
  rating: number;
}

export interface CategoryAnalyticsState {
  selectedChannel: string;
  selectedYear: string;
  selectedMonth: string;
  selectedCategory: string;
}
