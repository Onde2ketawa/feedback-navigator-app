
import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { sidebarNavItems } from '@/config/navigation';
import { SidebarNav } from './SidebarNav';
import UserProfile from '@/components/auth/UserProfile';
import { useAuth } from '@/contexts/AuthContext';

interface MainSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export function MainSidebar({ isOpen, toggleSidebar }: MainSidebarProps) {
  const { user, isAdmin, signOut } = useAuth();

  // Role string
  const role = isAdmin ? 'admin' : 'user';
  // Dapatkan nama/email user
  const userName =
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    user?.email ||
    'User';

  // Filter menu by role
  const filteredNavItems = sidebarNavItems.filter((item) =>
    item.allowedRoles?.includes(role)
  );

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen transition-width duration-300 bg-card border-r flex flex-col",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div className="flex-1 px-3 py-4">
        <div className="flex items-center justify-between mb-6">
          {isOpen && <h2 className="text-xl font-semibold">Analytics</h2>}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-muted"
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
        <SidebarNav items={filteredNavItems} isOpen={isOpen} />
      </div>

      {/* User Profile Section */}
      <div className="border-t p-4 flex items-center gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="rounded-full bg-muted text-primary flex items-center justify-center w-10 h-10 font-semibold text-lg uppercase">
            {userName.substring(0,2)}
          </div>
          {isOpen && (
            <div className="min-w-0 flex flex-col truncate">
              <span className="font-medium text-base truncate">{userName}</span>
              <span className="text-xs text-muted-foreground capitalize truncate">{role}</span>
            </div>
          )}
        </div>
        <button
          className="ml-auto p-2 rounded-full hover:bg-muted"
          onClick={signOut}
          title="Log out"
        >
          <LogOut size={20} className="text-primary" />
        </button>
      </div>
    </aside>
  );
}
