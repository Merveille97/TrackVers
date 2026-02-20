
import React from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import DashboardPage from '@/pages/DashboardPage';
import ProfilePage from '@/pages/ProfilePage';
import AdminPage from '@/pages/AdminPage';
import AdminEOLManagement from '@/pages/AdminEOLManagement';
import EOLManagementPage from '@/pages/EOLManagementPage';
import AboutPage from '@/pages/AboutPage';
import DocumentationPage from '@/pages/DocumentationPage';
import AdminRoute from '@/components/AdminRoute';
import { Toaster } from '@/components/ui/toaster';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const from = location.pathname;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" state={{ from }} replace />;
};

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="documentation" element={<DocumentationPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route
            path="dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="eol-management"
            element={
              <PrivateRoute>
                <EOLManagementPage />
              </PrivateRoute>
            }
          />
          
          {/* Admin Routes */}
          <Route
            path="admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />
          <Route
            path="admin/eol"
            element={
              <AdminRoute>
                <AdminEOLManagement />
              </AdminRoute>
            }
          />
        </Route>
      </Routes>
      
      <Toaster />
    </>
  );
}

export default App;
