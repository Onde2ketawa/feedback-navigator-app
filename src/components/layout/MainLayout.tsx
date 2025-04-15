
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import MainSidebar from './MainSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  const { isLoading } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MainSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <main
        className={cn(
          "transition-all duration-300 min-h-screen",
          isSidebarOpen ? "ml-64" : isMobile ? "ml-0" : "ml-16"
        )}
      >
        <div className="container py-6 px-4 md:px-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
