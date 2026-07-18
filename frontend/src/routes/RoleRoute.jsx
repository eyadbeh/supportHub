import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function RoleRoute({ allowedRoles }) {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const hasRole = user.roles.some((role) => allowedRoles.includes(role));

  if (!hasRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
