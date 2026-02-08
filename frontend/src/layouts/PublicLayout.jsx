import { NavLink, Outlet } from "react-router-dom";
import { isLoggedIn } from "../auth/authService";

export default function PublicLayout() {
  const logged = isLoggedIn();

  return (
    <>
      <div className="topbar">
        <div className="container nav">
          <div style={{ fontWeight: 800 }}>Ponuda stanova</div>

          <div className="nav-links">
            <NavLink className="link" to="/">Zgrade</NavLink>
            <NavLink className="link" to="/contact">Kontakt</NavLink>
            {logged ? (
              <NavLink className="link" to="/app">App</NavLink>
            ) : (
              <NavLink className="link" to="/login">Login</NavLink>
            )}
          </div>
        </div>
      </div>

      <div className="container">
        <Outlet />
      </div>
    </>
  );
}
