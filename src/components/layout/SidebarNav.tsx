
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

interface SidebarNavProps {
  items: {
    href: string;
    title: string;
    icon: React.ElementType;
  }[];
  isOpen: boolean;
}

export function SidebarNav({ items, isOpen }: SidebarNavProps) {
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
