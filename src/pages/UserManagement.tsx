
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserManagementTable } from '@/components/user-management/UserManagementTable';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Types for user profile data
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const UserManagement: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all');

  // Fetch all users using the admin-only security definer function
  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_all_user_profiles');

      if (error) {
        throw new Error(error.message);
      }
      
      return data as UserProfile[];
    },
  });

  // Filter users based on active tab
  const filteredUsers = React.useMemo(() => {
    if (!users) return [];
    
    switch (activeTab) {
      case 'admins':
        return users.filter(user => user.role === 'admin');
      case 'users':
        return users.filter(user => user.role === 'user');
      case 'active':
        return users.filter(user => user.status === 'active');
      case 'inactive':
        return users.filter(user => user.status === 'inactive');
      default:
        return users;
    }
  }, [users, activeTab]);

  // Handle user role change using the admin-only security definer function
  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase.rpc('update_user_role', {
        user_id: userId,
        new_role: newRole
      });

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "Role updated",
        description: "User role has been updated successfully",
      });
      
      refetch();
    } catch (error) {
      console.error("Error updating role:", error);
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "An error occurred while updating user role",
        variant: "destructive",
      });
    }
  };

  // Handle user status change using the admin-only security definer function
  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      const { error } = await supabase.rpc('update_user_status', {
        user_id: userId,
        new_status: newStatus
      });

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "Status updated",
        description: `User is now ${newStatus}`,
      });
      
      refetch();
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "An error occurred while updating user status",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <PageHeader
          title="User Management"
          description="Manage user accounts, roles, and permissions"
        />
        <Card className="mt-6">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertDescription>
                Error loading users: {error instanceof Error ? error.message : "Unknown error"}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="User Management"
        description="Manage user accounts, roles, and permissions"
      />

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            View and manage all users in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="admins">Admins</TabsTrigger>
              <TabsTrigger value="users">Regular Users</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab}>
              <UserManagementTable 
                users={filteredUsers} 
                isLoading={isLoading} 
                onRoleChange={handleRoleChange}
                onStatusChange={handleStatusChange}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
