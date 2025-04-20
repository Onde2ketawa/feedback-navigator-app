
import { TimeDistributionData, CategoryTimeData, DeviceTimeData } from '../types';

export const getMonthSortOrder = (monthName: string): number => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  for (let i = 0; i < months.length; i++) {
    if (monthName.includes(months[i])) {
      return i;
    }
  }
  return 12;
};

export const transformMonthlyData = (monthlyData: Record<string, number>): TimeDistributionData[] => {
  return Object.entries(monthlyData).map(([month, count]) => {
    const [year, monthNum] = month.split('-');
    const date = new Date(parseInt(year), parseInt(monthNum) - 1);
    const monthName = date.toLocaleString('default', { month: 'long' });
    return {
      label: `${monthName} ${year}`,
      count,
      sortOrder: (parseInt(year) * 100) + parseInt(monthNum)
    };
  }).sort((a, b) => a.sortOrder! - b.sortOrder!);
};

export const transformDailyData = (dailyData: Record<string, number>): TimeDistributionData[] => {
  return Object.entries(dailyData).map(([day, count]) => ({
    label: `Day ${day}`,
    count,
    sortOrder: parseInt(day)
  })).sort((a, b) => a.sortOrder! - b.sortOrder!);
};

export const transformHourlyData = (hourlyData: Record<string, number>): TimeDistributionData[] => {
  return Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return {
      label: `${hour}:00`,
      count: hourlyData[hour] || 0,
      sortOrder: i
    };
  });
};

export const transformCategoryData = (categoryByMonthData: Record<string, Record<string, number>>): CategoryTimeData[] => {
  return Object.entries(categoryByMonthData).map(([category, monthData]) => ({
    category,
    values: Object.entries(monthData).map(([month, count]) => {
      const [year, monthNum] = month.split('-');
      const date = new Date(parseInt(year), parseInt(monthNum) - 1);
      const monthName = date.toLocaleString('default', { month: 'short' });
      return {
        timeLabel: `${monthName} ${year}`,
        count,
        sortOrder: (parseInt(year) * 100) + parseInt(monthNum)
      };
    }).sort((a, b) => a.sortOrder! - b.sortOrder!)
  }));
};

export const transformDeviceData = (deviceByMonthData: Record<string, Record<string, number>>): DeviceTimeData[] => {
  return Object.entries(deviceByMonthData).map(([device, monthData]) => ({
    device,
    values: Object.entries(monthData).map(([month, count]) => {
      const [year, monthNum] = month.split('-');
      const date = new Date(parseInt(year), parseInt(monthNum) - 1);
      const monthName = date.toLocaleString('default', { month: 'short' });
      return {
        timeLabel: `${monthName} ${year}`,
        count,
        sortOrder: (parseInt(year) * 100) + parseInt(monthNum)
      };
    }).sort((a, b) => a.sortOrder! - b.sortOrder!)
  }));
};
