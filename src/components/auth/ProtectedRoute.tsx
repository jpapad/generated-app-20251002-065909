import { Navigate, Outlet } from 'react-router-dom';
import { useUserStore } from '@/stores/user-store';
export function ProtectedRoute() {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}