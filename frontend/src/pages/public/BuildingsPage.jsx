import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/apiClient";

export default function BuildingsPage() {
  const [buildings, setBuildings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/buildings")
      .then((data) => setBuildings(Array.isArray(data) ? data : []))
      .catch((err) => {
        const details = err?.status ? ` (HTTP ${err.status})` : "";
        setError((err?.message || "Greška pri učitavanju zgrada") + details);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Učitavanje...</div>;
  if (error) return <div style={{ color: "crimson" }}>{error}</div>;

  return (
    <div>
      <h2>Zgrade</h2>

      {buildings.length === 0 ? (
        <div>Nema zgrada.</div>
      ) : (
        <ul>
          {buildings.map((b) => (
            <li key={b.id} style={{ marginBottom: 8 }}>
              <div>
                <b>{b.name}</b> {b.address ? `— ${b.address}` : ""}
              </div>
              <Link to={`/buildings/${b.id}`}>Pogledaj stanove</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
