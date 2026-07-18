import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { authApi } from '@/api/authApi';
import { setUser, logout } from '@/store/authSlice';

export default function ProtectedRoute() {
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      if (token && !user) {
        try {
          const { data } = await authApi.getMe();
          dispatch(setUser(data));
        } catch (error) {
          // If token is invalid/expired, logout
          dispatch(logout());
        }
      }
    };

    fetchUser();
  }, [token, user, dispatch]);

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Optionally, show a loading spinner while fetching user
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return <Outlet />;
}
