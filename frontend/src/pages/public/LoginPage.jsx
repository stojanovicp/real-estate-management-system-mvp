import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../../api/apiClient";
import { isLoggedIn, setAuth } from "../../auth/authService";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoggedIn()) navigate("/app", { replace: true });
  }, [navigate]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // backend sada vraća: { token, user: { id, email, role } }
      const data = await api.post("/auth/login", { email, password });

      if (!data?.token || !data?.user?.role) {
        throw new Error("Login odgovor nema token/user.role");
      }

      setAuth(data.token, data.user);

      const redirectTo = location.state?.from || "/app";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err?.message || "Neuspešan login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420 }}>
      <h2>Login</h2>

      {error ? (
        <div style={{ marginBottom: 12, color: "crimson" }}>{error}</div>
      ) : null}

      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: 10 }}>
          <label>Email</label>
          <input
            style={{ width: "100%" }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Password</label>
          <input
            style={{ width: "100%" }}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Prijavljivanje..." : "Prijavi se"}
        </button>
      </form>
    </div>
  );
}
