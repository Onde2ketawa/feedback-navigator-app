import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  UploadCloud, 
  Grid, 
  BarChart, 
  PieChart,
  Tags,
  Menu,
  X,
  FileSpreadsheet,
  Home,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import UserProfile from '@/components/auth/UserProfile';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const MainSidebar: React.FC<SidebarProps> = ({
  isOpen,
  toggleSidebar
}) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { isAdmin } = useAuth();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <Home className="h-5 w-5" />,
      requireAdmin: false
    },
    {
      name: 'Upload',
      href: '/upload',
      icon: <UploadCloud className="h-5 w-5" />,
      requireAdmin: true
    },
    {
      name: 'CSV Upload',
      href: '/csv-upload',
      icon: <FileSpreadsheet className="h-5 w-5" />,
      requireAdmin: true
    },
    {
      name: 'Categories',
      href: '/categories',
      icon: <Tags className="h-5 w-5" />,
      requireAdmin: true
    },
    {
      name: 'User Management',
      href: '/users',
      icon: <Users className="h-5 w-5" />,
      requireAdmin: true
    },
    {
      name: 'Review Dashboard',
      href: '/dashboard',
      icon: <Grid className="h-5 w-5" />,
      requireAdmin: false
    },
    {
      name: 'Rating Analytics',
      href: '/rating-analytics',
      icon: <BarChart className="h-5 w-5" />,
      requireAdmin: false
    },
    {
      name: 'Category Analytics',
      href: '/category-analytics',
      icon: <PieChart className="h-5 w-5" />,
      requireAdmin: false
    }
  ];

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300",
        isOpen ? "w-64" : isMobile ? "w-0" : "w-16",
        "flex flex-col border-r border-sidebar-border"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        <h2 className={cn(
          "font-semibold text-sidebar-foreground transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}>
          Sentiment Analysis
        </h2>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className="text-sidebar-foreground"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
      
      <Separator className="bg-sidebar-border" />
      
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            if (item.requireAdmin && !isAdmin) {
              return null;
            }
            
            if (item.name === 'Dashboard') {
              return null;
            }
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center rounded-md py-2 px-3 text-sm font-medium transition-colors",
                  location.pathname === item.href
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  !isOpen && "justify-center"
                )}
              >
                {item.icon}
                <span className={cn(
                  "ml-3 transition-opacity duration-300",
                  isOpen ? "opacity-100" : "opacity-0 w-0 h-0 overflow-hidden"
                )}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className={cn(
        "p-4 border-t border-sidebar-border flex items-center",
        !isOpen && "justify-center"
      )}>
        <UserProfile />
        {isOpen && (
          <div className="ml-2 flex flex-col">
            <span className="text-xs text-sidebar-foreground opacity-60">
              {isAdmin ? 'Admin Access' : 'User Access'}
            </span>
          </div>
        )}
      </div>
    </aside>
  );
};

export default MainSidebar;
