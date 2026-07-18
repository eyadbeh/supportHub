import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function GuestRoute() {
  const { authenticated, user } = useSelector((state) => state.auth);

  if (authenticated) {
    const isAdmin = user?.roles?.includes('Admin');
    const isSupport = user?.roles?.includes('Support');
    
    if (isAdmin) return <Navigate to="/admin" replace />;
    if (isSupport) return <Navigate to="/tickets" replace />; // Or dashboard
    
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
