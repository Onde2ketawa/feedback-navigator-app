
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

interface DataWithTotals {
  month: string;
  year: string;
  positive: number;
  neutral: number;
  negative: number;
  total: number;
  positivePercentage: string;
}

interface SentimentTrendTableProps {
  tableData: DataWithTotals[];
}

export const SentimentTrendTable: React.FC<SentimentTrendTableProps> = ({ tableData }) => {
  if (!tableData.length) {
    return (
      <div className="mt-6 text-center text-muted-foreground">
        No sentiment trend data available for table display
      </div>
    );
  }

  return (
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
          {tableData.map((d, idx) => (
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
  );
};
