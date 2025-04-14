
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Upload from "./pages/Upload";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import RatingAnalytics from "./pages/RatingAnalytics";
import CategoryAnalytics from "./pages/CategoryAnalytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <MainLayout>
              <Upload />
            </MainLayout>
          } />
          <Route path="/upload" element={
            <MainLayout>
              <Upload />
            </MainLayout>
          } />
          <Route path="/dashboard" element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          } />
          <Route path="/categories" element={
            <MainLayout>
              <Categories />
            </MainLayout>
          } />
          <Route path="/rating-analytics" element={
            <MainLayout>
              <RatingAnalytics />
            </MainLayout>
          } />
          <Route path="/category-analytics" element={
            <MainLayout>
              <CategoryAnalytics />
            </MainLayout>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
