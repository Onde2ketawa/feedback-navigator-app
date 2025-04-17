
import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CsvSearchBoxProps {
  search: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
}

export const CsvSearchBox: React.FC<CsvSearchBoxProps> = ({ 
  search, 
  onSearchChange, 
  onClearSearch 
}) => {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Cari..."
        value={search}
        onChange={onSearchChange}
        className="pl-8 pr-8"
      />
      {search && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-9 w-9 p-0"
          onClick={onClearSearch}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Hapus pencarian</span>
        </Button>
      )}
    </div>
  );
};
