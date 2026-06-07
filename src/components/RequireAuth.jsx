import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';

export function RequireAuth({ children }) {
  const { isAuthenticated, loadingUser } = useAuth();
  const location = useLocation();

  if (loadingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb] text-sm text-[#536079]">
        Loading APILens session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
