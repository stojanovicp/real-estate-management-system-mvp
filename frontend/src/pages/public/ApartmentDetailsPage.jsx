import { useEffect, useState } from "react";
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

export default function ApartmentDetailsPage() {
  const { id } = useParams(); // apartmentId

  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [statusMsg, setStatusMsg] = useState("");
  const [statusType, setStatusType] = useState(""); // "success" | "error"
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError("");

    api
      .get(`/apartments/${id}`)
      .then((data) => setApartment(data))
      .catch((err) => {
        const details = err?.status ? ` (HTTP ${err.status})` : "";
        setError((err?.message || "Greška pri učitavanju stana") + details);
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function submitInquiry(e) {
    e.preventDefault();
    setStatusMsg("");
    setStatusType("");

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatusType("error");
      setStatusMsg("Popuni ime, email i poruku.");
      return;
    }

    try {
      setSending(true);
      await api.post("/inquiries", {
        apartmentId: Number(id),
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });

      setName("");
      setEmail("");
      setMessage("");
      setStatusType("success");
      setStatusMsg("Upit je uspešno poslat.");
    } catch (err) {
      setStatusType("error");
      setStatusMsg(err?.message || "Greška pri slanju upita");
    } finally {
      setSending(false);
    }
  }

  return (
    <ApiState
      loading={loading}
      error={error}
      empty={!apartment}
      emptyText="Stan nije pronađen."
    >
      <div>
        <div className="page-head">
          <div>
            <h2 className="page-title">Detalji stana</h2>
            <p className="page-sub">Pregled podataka i slanje upita.</p>
          </div>

          <div>
            <Link className="link" to={`/buildings/${apartment?.buildingId}`}>
              ← Nazad na stanove
            </Link>
          </div>
        </div>

        <div className="grid grid-2">
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 6 }}>
                  Stan #{apartment?.number ?? apartment?.id}
                </div>
                <div className="muted">
                  {apartment?.rooms != null ? `${apartment.rooms} soba` : "Sobe: -"} •{" "}
                  Sprat: {apartment?.floor ?? "-"} •{" "}
                  {apartment?.area ? `${apartment.area} m²` : "Površina: -"}
                </div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                  <span className={badgeClassForStatus(apartment?.status)}>
                    {apartment?.status || "N/A"}
                  </span>
                  <span className="badge">
                    {apartment?.price != null ? `${apartment.price} €` : "Cena: -"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginTop: 0 }}>Pošalji upit</h3>

            {statusMsg ? (
              <div
                className={statusType === "success" ? "success" : "error"}
                style={{ marginBottom: 10 }}
              >
                {statusMsg}
              </div>
            ) : null}

            <form onSubmit={submitInquiry}>
              <div style={{ marginBottom: 10 }}>
                <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>Ime</label>
                <input
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Unesi ime"
                  disabled={sending}
                />
              </div>

              <div style={{ marginBottom: 10 }}>
                <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>Email</label>
                <input
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="npr. petar@email.com"
                  disabled={sending}
                />
              </div>

              <div style={{ marginBottom: 10 }}>
                <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>Poruka</label>
                <textarea
                  className="textarea"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Napiši pitanje ili zahtev..."
                  disabled={sending}
                />
              </div>

              <button className="btn btn-primary" type="submit" disabled={sending}>
                {sending ? "Slanje..." : "Pošalji upit"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </ApiState>
  );
}
