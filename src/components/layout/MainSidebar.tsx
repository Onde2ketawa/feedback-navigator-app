
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { sidebarNavItems } from '@/config/navigation';

interface SidebarNavProps {
  items: {
    href: string;
    title: string;
    icon: React.ElementType;
  }[];
}

interface MainSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export function MainSidebar({ isOpen, toggleSidebar }: MainSidebarProps) {
  const location = useLocation();
  
  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-40 h-screen transition-width duration-300 bg-card border-r",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div className="h-full px-3 py-4">
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
    </aside>
  );
}

function SidebarNav({ items, isOpen }: SidebarNavProps & { isOpen: boolean }) {
  const location = useLocation();
  const pathname = location.pathname;
  
  return (
    <nav className="grid items-start gap-2">
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <Link
            key={index}
            to={item.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              pathname === item.href
                ? "bg-muted hover:bg-muted text-primary"
                : "hover:bg-transparent hover:underline",
              "justify-start",
              !isOpen && "justify-center px-2"
            )}
            title={!isOpen ? item.title : undefined}
          >
            <Icon className="mr-2 h-4 w-4" />
            {isOpen && item.title}
          </Link>
        );
      })}
    </nav>
  );
}
