
import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { sidebarNavItems } from '@/config/navigation';
import { SidebarNav } from './SidebarNav';
import UserProfile from '@/components/auth/UserProfile';

interface MainSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export function MainSidebar({ isOpen, toggleSidebar }: MainSidebarProps) {
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
          >
            {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
        <SidebarNav items={sidebarNavItems} isOpen={isOpen} />
      </div>

      {/* User Profile Section */}
      <div className="border-t p-4">
        <UserProfile />
      </div>
    </aside>
  );
}
