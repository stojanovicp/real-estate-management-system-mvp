import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../api/apiClient";
import ApiState from "../../components/ApiState";

function statusBadgeClass(status) {
  if (status === "AVAILABLE") return "badge badge--ok";
  if (status === "RESERVED")  return "badge badge--warn";
  if (status === "SOLD")      return "badge badge--bad";
  return "badge";
}

function statusLabel(status) {
  if (status === "AVAILABLE") return "Dostupan";
  if (status === "RESERVED")  return "Rezervisan";
  if (status === "SOLD")      return "Prodat";
  return status || "—";
}

export default function ApartmentsPage() {
  const { id } = useParams();
  const [apartments, setApartments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [filterFloor,  setFilterFloor]  = useState("");
  const [filterRooms,  setFilterRooms]  = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

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
    return apartments.filter((a) => {
      if (filterFloor !== "" && !Number.isNaN(Number(filterFloor))) {
        if (Number(a.floor) !== Number(filterFloor)) return false;
      }
      if (filterRooms !== "" && !Number.isNaN(Number(filterRooms))) {
        if (Number(a.rooms) < Number(filterRooms)) return false;
      }
      if (filterStatus !== "all" && a.status !== filterStatus) return false;
      return true;
    });
  }, [apartments, filterFloor, filterRooms, filterStatus]);

  return (
    <ApiState
      loading={loading}
      error={error}
      empty={filtered.length === 0}
      emptyText="Nema stanova koji odgovaraju filteru."
    >
      <div>
        <div className="page-head">
          <div>
            <h2 className="page-title">Stanovi</h2>
            <p className="page-sub">Filtriraj i otvori detalje stana.</p>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div>
              <label className="muted" style={{ display: "block", marginBottom: 4, fontSize: 13 }}>
                Sprat
              </label>
              <input
                className="input"
                style={{ width: 80 }}
                value={filterFloor}
                onChange={(e) => setFilterFloor(e.target.value)}
                placeholder="npr. 2"
                type="number"
                min="0"
              />
            </div>

            <div>
              <label className="muted" style={{ display: "block", marginBottom: 4, fontSize: 13 }}>
                Min soba
              </label>
              <input
                className="input"
                style={{ width: 90 }}
                value={filterRooms}
                onChange={(e) => setFilterRooms(e.target.value)}
                placeholder="npr. 2"
                type="number"
                min="1"
              />
            </div>

            <div>
              <label className="muted" style={{ display: "block", marginBottom: 4, fontSize: 13 }}>
                Status
              </label>
              <select
                className="select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Svi</option>
                <option value="AVAILABLE">Dostupan</option>
                <option value="RESERVED">Rezervisan</option>
                <option value="SOLD">Prodat</option>
              </select>
            </div>
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
                    {a.rooms != null ? `${a.rooms} soba` : "Sobe: -"} • Sprat:{" "}
                    {a.floor ?? "-"} • {a.area ? `${a.area} m²` : "Površina: -"}
                  </div>

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
                    <span className={statusBadgeClass(a.status)}>{statusLabel(a.status)}</span>
                    <span className="badge">
                      {a.priceOnRequest
                        ? "Cena na upit"
                        : a.price != null
                        ? `${a.price} €`
                        : "Cena: -"}
                    </span>
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
