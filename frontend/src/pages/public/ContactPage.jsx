import { useState } from "react";
import { api } from "../../api/apiClient";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSending(true);

    try {
      await api.post("/inquiries", {
        // apartmentId se ne šalje => opšti upit
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

  return (
    <div style={{ maxWidth: 520 }}>
      <h2>Kontakt</h2>

      {error ? (
        <div style={{ marginBottom: 12, color: "crimson" }}>{error}</div>
      ) : null}

      {success ? (
        <div style={{ marginBottom: 12, color: "green" }}>{success}</div>
      ) : null}

      <form onSubmit={onSubmit}>
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
