import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearAuth, getRole, getUser } from "../auth/authService";

function linkStyle({ isActive }) {
  return {
    display: "block",
    padding: "8px 10px",
    textDecoration: "none",
    borderRadius: 6,
    color: "black",
    background: isActive ? "#eee" : "transparent",
  };
}

export default function AppLayout() {
  const navigate = useNavigate();
  const role = getRole();
  const user = getUser();

  function logout() {
    clearAuth();
    navigate("/", { replace: true });
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: 240, borderRight: "1px solid #ddd", padding: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 700 }}>Interni deo</div>
          <div style={{ fontSize: 12, color: "#555" }}>
            {user?.email || ""} {role ? `(${role})` : ""}
          </div>
        </div>

        <nav style={{ display: "grid", gap: 6 }}>
          {/* Admin */}
          {role === "admin" && (
            <NavLink to="/app/buildings" style={linkStyle}>
              Zgrade
            </NavLink>
          )}

          {/* Admin + Owner */}
          {(role === "admin" || role === "owner") && (
            <NavLink to="/app/apartments" style={linkStyle}>
              Stanovi
            </NavLink>
          )}

          {/* Admin + Owner + Staff */}
          {(role === "admin" || role === "owner" || role === "staff") && (
            <NavLink to="/app/inquiries" style={linkStyle}>
              Upiti
            </NavLink>
          )}

          <button
            onClick={logout}
            style={{
              marginTop: 12,
              padding: "8px 10px",
              borderRadius: 6,
              border: "1px solid #ddd",
              background: "white",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            Logout
          </button>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: 16 }}>
        <Outlet />
      </main>
    </div>
  );
}
