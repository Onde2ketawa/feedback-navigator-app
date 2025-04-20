
export interface TimeDistributionData {
  label: string;
  count: number;
  sortOrder?: number;
}

export interface CategoryTimeData {
  category: string;
  values: {
    timeLabel: string;
    count: number;
    sortOrder?: number;
  }[];
}

export interface DeviceTimeData {
  device: string;
  values: {
    timeLabel: string;
    count: number;
    sortOrder?: number;
  }[];
}

export interface TimeAnalyticsState {
  monthlyDistribution: TimeDistributionData[];
  dailyDistribution: TimeDistributionData[];
  hourlyDistribution: TimeDistributionData[];
  categoryTimeData: CategoryTimeData[];
  deviceTimeData: DeviceTimeData[];
  isLoading: boolean;
  error: Error | null;
}
