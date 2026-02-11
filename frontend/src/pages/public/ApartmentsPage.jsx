import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../api/apiClient";
import ApiState from "../../components/ApiState";

function badgeClassForStatus(status) {
  const s = String(status || "").toLowerCase();
  if (s.includes("available") || s.includes("slob") || s.includes("free")) return "badge badge--ok";
  if (s.includes("reserved") || s.includes("rez")) return "badge badge--warn";
  if (s.includes("sold") || s.includes("prod")) return "badge badge--bad";
  return "badge";
}

export default function ApartmentsPage() {
  const { id } = useParams(); // buildingId
  const [apartments, setApartments] = useState([]);
  const [minRooms, setMinRooms] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError("");

    api
      .get(`/buildings/${id}/apartments`)
      .then((data) => setApartments(Array.isArray(data) ? data : []))
      .catch((err) => {
        const details = err?.status ? ` (HTTP ${err.status})` : "";
        setError((err?.message || "Greška pri učitavanju stanova") + details);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const filtered = useMemo(() => {
    const n = Number(minRooms);
    if (!minRooms || Number.isNaN(n)) return apartments;
    return apartments.filter((a) => Number(a.rooms) >= n);
  }, [apartments, minRooms]);

  return (
    <ApiState
      loading={loading}
      error={error}
      empty={filtered.length === 0}
      emptyText="Nema stanova."
    >
      <div>
        <div className="page-head">
          <div>
            <h2 className="page-title">Stanovi</h2>
            <p className="page-sub">Filtriraj po broju soba i otvori detalje stana.</p>
          </div>

          <div style={{ width: 220 }}>
            <label className="muted" style={{ display: "block", marginBottom: 6, fontSize: 13 }}>
              Min soba
            </label>
            <input
              className="input"
              value={minRooms}
              onChange={(e) => setMinRooms(e.target.value)}
              placeholder="npr. 2"
            />
          </div>
        </div>

        <div className="grid grid-2">
          {filtered.map((a) => (
            <div className="card" key={a.id}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 800, marginBottom: 4 }}>
                    Stan #{a.number ?? a.id}
                  </div>
                  <div className="muted">
                    {a.rooms} • Sprat: {a.floor ?? "-"} • {a.area ? `${a.area} m²` : "Površina: -"}
                  </div>

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
                    <span className={badgeClassForStatus(a.status)}>{a.status || "N/A"}</span>
                    <span className="badge">{a.price != null ? `${a.price} €` : "Cena: -"}</span>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                  <Link className="link" to={`/apartments/${a.id}`}>
                    Detalj →
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
