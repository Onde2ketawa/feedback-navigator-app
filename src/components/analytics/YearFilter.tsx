import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface YearFilterProps {
  availableYears: string[];
  selectedYears: string[];
  onChange: (years: string[]) => void;
  maxSelections?: number;
}

export const YearFilter = ({ 
  selectedYears, 
  onChange, 
  maxSelections = 3 
}: YearFilterProps) => {
  // Hardcode available years to 2024-2025
  const availableYears = ['2024', '2025'];

  const handleYearToggle = (year: string) => {
    if (selectedYears.includes(year)) {
      onChange(selectedYears.filter(y => y !== year));
    } else {
      if (selectedYears.length < maxSelections) {
        onChange([...selectedYears, year].sort((a, b) => b.localeCompare(a))); // Sort descending
      }
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-start">
          <Calendar className="mr-2 h-4 w-4" />
          {selectedYears.length > 0 
            ? `Years: ${selectedYears.join(', ')}`
            : "Select years"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        <div className="space-y-4">
          <Label>Compare Years (max {maxSelections})</Label>
          <div className="grid grid-cols-2 gap-2">
            {availableYears.map((year) => (
              <div key={year} className="flex items-center space-x-2">
                <Checkbox
                  id={`year-${year}`}
                  checked={selectedYears.includes(year)}
                  onCheckedChange={() => handleYearToggle(year)}
                  disabled={!selectedYears.includes(year) && selectedYears.length >= maxSelections}
                />
                <Label htmlFor={`year-${year}`}>{year}</Label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
