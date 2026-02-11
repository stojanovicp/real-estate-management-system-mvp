import { useEffect, useMemo, useState } from "react";
import { api } from "../../api/apiClient";
import { getRole } from "../../auth/authService";
import DataTable from "../../components/DataTable";
import ApiState from "../../components/ApiState";

function endpointForRole(role) {
  if (role === "admin") return "/admin/inquiries";
  if (role === "owner") return "/owner/inquiries";
  if (role === "staff") return "/staff/inquiries";
  return null;
}

function formatDateOnly(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("sr-RS");
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
      {
        key: "createdAt",
        header: "Kreirano",
        render: (r) => formatDateOnly(r.createdAt),
      },
    ],
    []
  );

  return (
    <div>
      <div className="page-head">
        <div>
          <h2 className="page-title">Upiti</h2>
          <p className="page-sub">Pregled upita (admin/owner/staff).</p>
        </div>
      </div>

      <ApiState
        loading={loading}
        error={error}
        empty={rows.length === 0}
        emptyText="Nema upita."
      >
        <DataTable columns={columns} rows={rows} />
      </ApiState>
    </div>
  );
}
