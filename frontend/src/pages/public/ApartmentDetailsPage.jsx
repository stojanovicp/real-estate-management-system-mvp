import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../api/apiClient";

export default function ApartmentDetailsPage() {
  const { id } = useParams();
  const [apartment, setApartment] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    setSuccess("");

    api
      .get(`/apartments/${id}`)
      .then((data) => setApartment(data))
      .catch((err) => {
        const details = err?.status ? ` (HTTP ${err.status})` : "";
        setError((err?.message || "Greška pri učitavanju stana") + details);
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSending(true);

    try {
      await api.post("/inquiries", {
        apartmentId: Number(id),
        name,
        email,
        phone,
        message,
      });
      setSuccess("Upit je poslat.");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err) {
      setError(err?.message || "Greška pri slanju upita");
    } finally {
      setSending(false);
    }
  }

  if (loading) return <div>Učitavanje...</div>;
  if (error) return <div style={{ color: "crimson" }}>{error}</div>;
  if (!apartment) return <div>Nije pronađen stan.</div>;

  return (
    <div>
      <h2>Detalj stana</h2>

      <div style={{ marginBottom: 12 }}>
        <div>
          <b>Broj:</b> {apartment.number ?? apartment.id}
        </div>
        <div>
          <b>Sobe:</b> {apartment.rooms}
        </div>
        {"price" in apartment ? (
          <div>
            <b>Cena:</b> {apartment.price}
          </div>
        ) : null}
        {"status" in apartment ? (
          <div>
            <b>Status:</b> {apartment.status}
          </div>
        ) : null}
      </div>

      <h3>Pošalji upit</h3>

      {success ? (
        <div style={{ marginBottom: 12, color: "green" }}>{success}</div>
      ) : null}

      <form onSubmit={onSubmit} style={{ maxWidth: 520 }}>
        <div style={{ marginBottom: 10 }}>
          <label>Ime</label>
          <input
            style={{ width: "100%" }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Email</label>
          <input
            style={{ width: "100%" }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Telefon (opciono)</label>
          <input
            style={{ width: "100%" }}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Poruka</label>
          <textarea
            style={{ width: "100%" }}
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <button type="submit" disabled={sending}>
          {sending ? "Slanje..." : "Pošalji"}
        </button>
      </form>
    </div>
  );
}
