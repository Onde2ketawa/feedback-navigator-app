
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import MainSidebar from './MainSidebar';
import { useIsMobile } from '@/hooks/use-mobile';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
