import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

function ProtectedRoute({ children }) {
  const { loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return <main className="auth-route-loading">טוען את החשבון...</main>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export default ProtectedRoute;
