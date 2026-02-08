import { Navigate, useLocation } from "react-router-dom";
import { getToken, getRole } from "./authService";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = getToken();
  const role = getRole();
  const location = useLocation();

  // nije ulogovan
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // ulogovan, ali nema dozvoljenu rolu
  if (allowedRoles && allowedRoles.length > 0) {
    if (!role || !allowedRoles.includes(role)) {
      return <Navigate to="/app" replace />;
    }
  }

  return children;
}
