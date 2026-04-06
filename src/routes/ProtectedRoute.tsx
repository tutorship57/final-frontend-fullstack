import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/type';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}
const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const {user, loading} = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }

  // 1. Check if user is logged in
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Check if user has the required role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // Redirect unauthorized users to home
  }

  return <>{children}</>;
};

export default ProtectedRoute