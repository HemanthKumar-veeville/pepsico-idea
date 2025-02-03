import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const hasAdminAccess = user?.role === "Admin" || user?.role === "CEO";

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (!hasAdminAccess) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

export default AdminRoute;
