import React from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Star, Tag } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { useIsMobile } from '@/hooks/use-mobile';

// Feedback type definition
interface Feedback {
  id: string;
  channel: string;
  rating: number;
  submitDate: string;
  submitTime?: string;
  feedback?: string;
  category?: string;
  subcategory?: string;
  device?: string;
  appVersion?: string;
  language?: string;
  sentiment?: string;
  sentiment_score?: number;
}

interface FeedbackTableProps {
  data: Feedback[];
  categories: { id: string; name: string }[];
  subcategories: { id: string; name: string }[];
  selectedRows: string[];
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
  openTagDialog: (feedback: Feedback) => void;
}

export const FeedbackTable: React.FC<FeedbackTableProps> = ({
  data,
  categories,
  subcategories,
  selectedRows,
  setSelectedRows,
  openTagDialog,
}) => {
  const isMobile = useIsMobile();

  // Column definitions
  const columns: ColumnDef<Feedback>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Input
          type="checkbox"
          className="h-4 w-4"
          checked={
            table.getFilteredRowModel().rows.length > 0 &&
            table.getIsAllRowsSelected()
          }
          onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
        />
      ),
      cell: ({ row }) => (
        <Input
          type="checkbox"
          className="h-4 w-4"
          checked={row.getIsSelected()}
          onChange={(e) => {
            row.toggleSelected(e.target.checked)
            
            // Update selected rows
            const id = row.original.id;
            if (e.target.checked) {
              setSelectedRows(prev => [...prev, id]);
            } else {
              setSelectedRows(prev => prev.filter(rowId => rowId !== id));
            }
          }}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "channel",
      header: "Channel",
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => {
        const rating = row.getValue("rating") as number;
        return (
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i} 
                className={`h-3 w-3 sm:h-4 sm:w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "submitDate",
      header: "Submit Date",
    },
    {
      accessorKey: "submitTime",
      header: "Submit Time",
      enableHiding: true,
    },
    {
      accessorKey: "feedback",
      header: "Feedback",
      cell: ({ row }) => {
        const feedback = row.getValue("feedback") as string;
        return feedback ? (
          <div className="max-w-[100px] sm:max-w-[150px] md:max-w-[300px] truncate">
            {feedback}
          </div>
        ) : (
          <span className="text-muted-foreground italic">No feedback</span>
        );
      },
    },
    {
      accessorKey: "device",
      header: "Device",
      enableHiding: true,
    },
    {
      accessorKey: "appVersion",
      header: "App Version",
      enableHiding: true,
    },
    {
      accessorKey: "language",
      header: "Language",
      enableHiding: true,
    },
    {
      accessorKey: "sentiment",
      header: "Sentiment",
      cell: ({ row }) => {
        const sentiment = row.getValue("sentiment") as string;
        let badgeClass = "px-1 sm:px-2 py-1 rounded text-xs font-medium";
        
        switch (sentiment?.toLowerCase()) {
          case 'positive':
            badgeClass += " bg-green-100 text-green-800";
            break;
          case 'negative':
            badgeClass += " bg-red-100 text-red-800";
            break;
          default:
            badgeClass += " bg-gray-100 text-gray-800";
        }
        
        return <span className={badgeClass}>{sentiment || 'N/A'}</span>;
      }
    },
    {
      accessorKey: "sentiment_score",
      header: "Score",
      cell: ({ row }) => {
        const score = row.original.sentiment_score;
        return <span>{score?.toFixed(2) || 'N/A'}</span>;
      },
      enableHiding: true,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const categoryId = row.getValue("category") as string | undefined;
        const subcategoryId = row.original.subcategory;
        
        if (!categoryId) {
          return <span className="text-muted-foreground italic">Uncategorized</span>;
        }
        
        const category = categories.find(c => c.id === categoryId);
        const subcategory = subcategoryId 
          ? subcategories.find(sc => sc.id === subcategoryId)
          : undefined;
          
        return (
          <div>
            <div className="font-medium text-xs sm:text-sm">{category?.name || 'Unknown'}</div>
            {subcategory && <div className="text-xs text-muted-foreground">{subcategory.name}</div>}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const feedback = row.original;
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openTagDialog(feedback)}>
                <Tag className="mr-2 h-4 w-4" />
                <span>Edit Tags</span>
              </DropdownMenuItem>
              {/* Add more dropdown actions as needed */}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // Hide certain columns on mobile
  const visibleColumns = React.useMemo(() => {
    if (isMobile) {
      return columns.map(column => {
        const columnId = column.id || (column as any).accessorKey as string;
        if (["submitTime", "device", "appVersion", "language", "sentiment_score"].includes(columnId)) {
          return {
            ...column,
            size: 0,
            minSize: 0,
          };
        }
        return column;
      });
    }
    return columns;
  }, [columns, isMobile]);

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <div className="min-w-full inline-block align-middle px-4 sm:px-0">
        <DataTable columns={visibleColumns} data={data} />
      </div>
    </div>
  );
};
