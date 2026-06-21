import { Navigate } from "react-router-dom";
import { getRole } from "../../auth/authService";

export default function AppHomePage() {
  const role = getRole();

  if (role === "ADMIN") return <Navigate to="/app/buildings" replace />;
  if (role === "EMPLOYEE") return <Navigate to="/app/inquiries" replace />;

  return <div>Nedozvoljen pristup.</div>;
}
