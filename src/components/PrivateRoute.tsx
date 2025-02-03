import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};

export default PrivateRoute;
