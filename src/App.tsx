
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import RatingAnalytics from "./pages/RatingAnalytics";
import CategoryAnalytics from "./pages/CategoryAnalytics";
import UserManagement from "./pages/UserManagement";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import CsvUpload from "./pages/CsvUpload";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public route for authentication */}
            <Route path="/auth" element={<Auth />} />

            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/categories" element={
              <ProtectedRoute requireAdmin>
                <MainLayout>
                  <Categories />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/csv-upload" element={
              <ProtectedRoute requireAdmin>
                <MainLayout>
                  <CsvUpload />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/users" element={
              <ProtectedRoute requireAdmin>
                <MainLayout>
                  <UserManagement />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/rating-analytics" element={
              <ProtectedRoute>
                <MainLayout>
                  <RatingAnalytics />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/category-analytics" element={
              <ProtectedRoute>
                <MainLayout>
                  <CategoryAnalytics />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
