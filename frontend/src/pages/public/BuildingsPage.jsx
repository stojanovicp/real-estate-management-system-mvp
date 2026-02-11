import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/apiClient";
import ApiState from "../../components/ApiState";

export default function BuildingsPage() {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    api
      .get("/buildings")
      .then((data) => setBuildings(Array.isArray(data) ? data : []))
      .catch((err) => {
        const details = err?.status ? ` (HTTP ${err.status})` : "";
        setError((err?.message || "Greška pri učitavanju zgrada") + details);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <ApiState
      loading={loading}
      error={error}
      empty={buildings.length === 0}
      emptyText="Nema dostupnih zgrada."
    >
      <div>
        <div className="page-head">
          <div>
            <h2 className="page-title">Zgrade</h2>
            <p className="page-sub">Izaberi zgradu da vidiš dostupne stanove.</p>
          </div>
        </div>

        <div className="grid grid-2">
          {buildings.map((b) => (
            <div className="card" key={b.id}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 800, marginBottom: 4 }}>
                    {b.name || `Zgrada #${b.id}`}
                  </div>
                  <div className="muted">{b.address || "Adresa: -"}</div>
                </div>

                <div style={{ display: "flex", alignItems: "flex-start" }}>
                  <Link className="link" to={`/buildings/${b.id}`}>
                    Stanovi →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ApiState>
  );
}
