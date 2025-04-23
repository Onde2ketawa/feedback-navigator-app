
/**
 * Month helpers for sentiment trend data
 */
export const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export function getMonthIdx(month: string) {
  return MONTHS.indexOf(month);
}

export function getMonthName(idx: number) {
  return MONTHS[idx] || "";
}
