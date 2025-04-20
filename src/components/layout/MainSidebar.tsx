
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import {
  LayoutDashboard,
  Star,
  MessageSquareText,
  Layers,
  Upload,
  Users,
  Clock,
} from 'lucide-react';

interface SidebarNavProps {
  items: {
    href: string;
    title: string;
    icon: React.ReactNode;
  }[];
}

export function MainSidebar() {
  const location = useLocation();
  
  // Define sidebar navigation items
  const sidebarNavItems = [
    {
      href: "/dashboard",
      title: "Dashboard",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
    },
    {
      href: "/rating-analytics",
      title: "Rating Analytics",
      icon: <Star className="mr-2 h-4 w-4" />,
    },
    {
      href: "/sentiment-analytics",
      title: "Sentiment Analytics",
      icon: <MessageSquareText className="mr-2 h-4 w-4" />,
    },
    {
      href: "/category-analytics",
      title: "Category Analytics",
      icon: <Layers className="mr-2 h-4 w-4" />,
    },
    {
      href: "/time-analytics",
      title: "Time Analytics",
      icon: <Clock className="mr-2 h-4 w-4" />,
    },
    {
      href: "/upload",
      title: "Upload",
      icon: <Upload className="mr-2 h-4 w-4" />,
    },
    {
      href: "/categories",
      title: "Categories",
      icon: <Layers className="mr-2 h-4 w-4" />,
    },
    {
      href: "/user-management",
      title: "User Management",
      icon: <Users className="mr-2 h-4 w-4" />,
    },
  ];
  
  return <SidebarNav items={sidebarNavItems} />;
}

function SidebarNav({ items }: SidebarNavProps) {
  const location = useLocation();
  const pathname = location.pathname;
  
  return (
    <nav className="grid items-start gap-2">
      {items.map((item, index) => (
        <Link
          key={index}
          to={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === item.href
              ? "bg-muted hover:bg-muted text-primary"
              : "hover:bg-transparent hover:underline",
            "justify-start"
          )}
        >
          {item.icon}
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
