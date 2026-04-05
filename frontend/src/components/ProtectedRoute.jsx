import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (role && user?.role !== role) {
    return <Navigate to={user?.role === 'teacher' ? '/teacher' : '/student'} replace />;
  }

  return children;
};

export default ProtectedRoute;
