import { Navigate } from "react-router-dom";
import { getRole } from "../../auth/authService";

export default function AppHomePage() {
  const role = getRole();

  if (role === "admin") return <Navigate to="/app/buildings" replace />;
  if (role === "owner") return <Navigate to="/app/apartments" replace />;
  if (role === "staff") return <Navigate to="/app/inquiries" replace />;

  return <div>Nedozvoljen pristup.</div>;
}
