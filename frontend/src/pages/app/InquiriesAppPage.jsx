import { useEffect, useMemo, useState } from "react";
import { api } from "../../api/apiClient";
import { getRole } from "../../auth/authService";
import DataTable from "../../components/DataTable";

function endpointForRole(role) {
  if (role === "admin") return "/admin/inquiries";
  if (role === "owner") return "/owner/inquiries";
  if (role === "staff") return "/staff/inquiries";
  return null;
}

export default function InquiriesAppPage() {
  const role = getRole();
  const endpoint = endpointForRole(role);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!endpoint) {
      setError("Nedozvoljen pristup.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    api
      .get(endpoint)
      .then((data) => setRows(Array.isArray(data) ? data : []))
      .catch((err) => setError(err?.message || "Greška pri učitavanju upita"))
      .finally(() => setLoading(false));
  }, [endpoint]);

  const columns = useMemo(
    () => [
      { key: "id", header: "ID" },
      { key: "name", header: "Ime" },
      { key: "email", header: "Email" },
      { key: "phone", header: "Telefon" },
      { key: "message", header: "Poruka" },
      { key: "apartmentId", header: "StanID" },
      { key: "createdAt", header: "Kreirano" },
    ],
    []
  );

  if (loading) return <div>Učitavanje...</div>;
  if (error) return <div style={{ color: "crimson" }}>{error}</div>;

  return (
    <div>
      <h2>Upiti</h2>
      <DataTable columns={columns} rows={rows} />
    </div>
  );
}
