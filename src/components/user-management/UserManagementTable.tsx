
import React from 'react';
import { format } from 'date-fns';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { DataTable } from '@/components/ui/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { UserProfile } from '@/pages/UserManagement';
import { useAuth } from '@/contexts/AuthContext';
import { ColumnDef } from '@tanstack/react-table';
import { Shield, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface UserManagementTableProps {
  users: UserProfile[];
  isLoading: boolean;
  onRoleChange: (userId: string, newRole: string) => void;
  onStatusChange: (userId: string, newStatus: string) => void;
}

export const UserManagementTable: React.FC<UserManagementTableProps> = ({
  users,
  isLoading,
  onRoleChange,
  onStatusChange,
}) => {
  const { user: currentUser } = useAuth();

  const columns: ColumnDef<UserProfile>[] = [
    {
      accessorKey: 'full_name',
      header: 'Name',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-2">
            {user.role === 'admin' ? (
              <Shield className="h-4 w-4 text-primary" />
            ) : (
              <User className="h-4 w-4 text-muted-foreground" />
            )}
            <span>{user.full_name}</span>
            {user.id === currentUser?.id && (
              <Badge variant="outline" className="ml-2">You</Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const user = row.original;
        const isCurrentUser = user.id === currentUser?.id;
        
        return (
          <Select
            defaultValue={user.role}
            onValueChange={(value) => onRoleChange(user.id, value)}
            disabled={isCurrentUser} // Can't change own role
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const user = row.original;
        const isActive = user.status === 'active';
        const isCurrentUser = user.id === currentUser?.id;
        
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={isActive}
              onCheckedChange={(checked) => {
                onStatusChange(user.id, checked ? 'active' : 'inactive');
              }}
              disabled={isCurrentUser} // Can't deactivate yourself
            />
            <span>{isActive ? 'Active' : 'Inactive'}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
      cell: ({ row }) => {
        const date = new Date(row.original.created_at);
        return <span>{format(date, 'MMM d, yyyy')}</span>;
      },
    },
    {
      accessorKey: 'updated_at',
      header: 'Last Updated',
      cell: ({ row }) => {
        const date = new Date(row.original.updated_at);
        return <span>{format(date, 'MMM d, yyyy')}</span>;
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return <DataTable columns={columns} data={users} />;
};
