import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../api/apiClient";

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

  if (loading) return <div>Učitavanje...</div>;
  if (error) return <div style={{ color: "crimson" }}>{error}</div>;

  return (
    <div>
      <h2>Stanovi</h2>

      <div style={{ marginBottom: 12 }}>
        <label>Min soba: </label>
        <input
          value={minRooms}
          onChange={(e) => setMinRooms(e.target.value)}
          style={{ width: 80, marginLeft: 8 }}
        />
      </div>

      {filtered.length === 0 ? (
        <div>Nema stanova.</div>
      ) : (
        <ul>
          {filtered.map((a) => (
            <li key={a.id} style={{ marginBottom: 8 }}>
              <div>
                <b>Stan #{a.number ?? a.id}</b> — {a.rooms} soba
                {a.price ? ` — ${a.price}` : ""}
              </div>
              <Link to={`/apartments/${a.id}`}>Detalj</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
