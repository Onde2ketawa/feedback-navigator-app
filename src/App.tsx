
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Layouts
import MainLayout from './components/layout/MainLayout';

// Pages
import Dashboard from './pages/Dashboard';
import RatingAnalytics from './pages/RatingAnalytics';
import SentimentAnalytics from './pages/SentimentAnalytics';
import CategoryAnalytics from './pages/CategoryAnalytics';
import TimeAnalytics from './pages/TimeAnalytics';
import Upload from './pages/Upload';
import CsvUpload from './pages/CsvUpload';
import Categories from './pages/Categories';
import Auth from './pages/Auth';
import UserManagement from './pages/UserManagement';
import Index from './pages/Index';
import NotFound from './pages/NotFound';

// Auth Context & Protection
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Other Components
import { Toaster } from './components/ui/toaster';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1, // retry failed queries only once
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
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
            <Route path="/sentiment-analytics" element={
              <ProtectedRoute>
                <MainLayout>
                  <SentimentAnalytics />
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
            <Route path="/time-analytics" element={
              <ProtectedRoute>
                <MainLayout>
                  <TimeAnalytics />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/upload" element={
              <ProtectedRoute>
                <MainLayout>
                  <Upload />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/csv-upload" element={
              <ProtectedRoute>
                <MainLayout>
                  <CsvUpload />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/categories" element={
              <ProtectedRoute>
                <MainLayout>
                  <Categories />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/user-management" element={
              <ProtectedRoute>
                <MainLayout>
                  <UserManagement />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
