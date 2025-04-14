
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
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';

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

  const navigationItems = [
    {
      name: 'Upload',
      href: '/upload',
      icon: <UploadCloud className="h-5 w-5" />
    },
    {
      name: 'Review Dashboard',
      href: '/dashboard',
      icon: <Grid className="h-5 w-5" />
    },
    {
      name: 'Categories',
      href: '/categories',
      icon: <Tags className="h-5 w-5" />
    },
    {
      name: 'Rating Analytics',
      href: '/rating-analytics',
      icon: <BarChart className="h-5 w-5" />
    },
    {
      name: 'Category Analytics',
      href: '/category-analytics',
      icon: <PieChart className="h-5 w-5" />
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
          {navigationItems.map((item) => (
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
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default MainSidebar;
