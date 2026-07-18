import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { authApi } from '@/api/authApi';
import { setUser, logout } from '@/store/authSlice';

export default function ProtectedRoute() {
  const { authenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await authApi.getMe();
        dispatch(setUser(data));
      } catch (error) {
        dispatch(logout());
      } finally {
        setIsCheckingAuth(false);
      }
    };

    if (!user) {
      checkAuth();
    } else {
      setIsCheckingAuth(false);
    }
  }, [user, dispatch]);

  if (isCheckingAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-slate-900 dark:text-white">Loading...</div>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
