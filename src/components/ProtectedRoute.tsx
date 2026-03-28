import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('user' | 'vendor' | 'admin')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, userRole, isLoading } = useAppStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
