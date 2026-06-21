import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../../api/apiClient";
import DataTable from "../../components/DataTable";
import EntityForm from "../../components/EntityForm";
import { getRole } from "../../auth/authService";

function badgeClassForStatus(status) {
  const s = String(status || "").toLowerCase();
  if (s.includes("available") || s.includes("slob") || s.includes("free")) return "badge badge--ok";
  if (s.includes("reserved") || s.includes("rez")) return "badge badge--warn";
  if (s.includes("sold") || s.includes("prod")) return "badge badge--bad";
  return "badge";
}

export default function ApartmentsAppPage() {
  const role = getRole(); // "ADMIN" | "EMPLOYEE"

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [mode, setMode] = useState("list"); // "list" | "create" | "edit"
  const [selected, setSelected] = useState(null);

  const listEndpoint = useMemo(() => {
    if (role === "ADMIN") return "/admin/apartments";
    return "/employee/apartments";
  }, [role]);

  const resetForm = useCallback(() => {
    setSelected(null);
    setMode("list");
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.get(listEndpoint);
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || "Greška pri učitavanju stanova");
    } finally {
      setLoading(false);
    }
  }, [listEndpoint]);

  useEffect(() => {
    load();
  }, [load]);

  const columns = useMemo(
    () => [
      { key: "id", header: "ID" },
      { key: "buildingId", header: "ZgradaID" },
      { key: "number", header: "Broj" },
      { key: "floor", header: "Sprat" },
      { key: "rooms", header: "Sobe" },
      { key: "area", header: "m²" },
      {
        key: "status",
        header: "Status",
        render: (r) => <span className={badgeClassForStatus(r.status)}>{r.status || "N/A"}</span>,
      },
      {
        key: "price",
        header: "Cena",
        render: (r) => <span className="badge">{r.price != null ? `${r.price} €` : "—"}</span>,
      },
    ],
    []
  );

  const actions = useMemo(() => {
    const base = [
      {
        label: "Izmeni",
        onClick: (r) => {
          setSelected(r);
          setMode("edit");
        },
      },
    ];

    if (role === "ADMIN") {
      base.push({
        label: "Obriši",
        onClick: async (r) => {
          if (!window.confirm(`Obrisati stan #${r.number ?? r.id}?`)) return;
          try {
            await api.del(`/admin/apartments/${r.id}`);
            await load();
          } catch (err) {
            alert(err?.message || "Greška pri brisanju");
          }
        },
      });
    }

    return base;
  }, [role, load]);

  const fields = useMemo(
    () => [
      { name: "buildingId", label: "Zgrada ID", type: "number" },
      { name: "number", label: "Broj stana", type: "text" },
      { name: "floor", label: "Sprat", type: "number" },
      { name: "rooms", label: "Broj soba", type: "number" },
      { name: "area", label: "Površina (m²)", type: "number" },
      { name: "price", label: "Cena (€)", type: "number" },
      { name: "status", label: "Status", type: "text", placeholder: "available / reserved / sold" },
    ],
    []
  );

  const create = useCallback(
    async (values) => {
      await api.post("/admin/apartments", values);
      await load();
      resetForm();
    },
    [load, resetForm]
  );

  const update = useCallback(
    async (values) => {
      const endpoint =
        role === "ADMIN"
          ? `/admin/apartments/${selected.id}`
          : `/employee/apartments/${selected.id}`;

      await api.put(endpoint, values);
      await load();
      resetForm();
    },
    [role, selected, load, resetForm]
  );

  if (loading) return <div>Učitavanje...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <div className="page-head">
        <div>
          <h2 className="page-title">Stanovi</h2>
          <p className="page-sub">
            {role === "ADMIN" ? "Admin upravljanje stanovima." : "Pregled i izmena stanova."}
          </p>
        </div>

        {mode === "list" && role === "ADMIN" ? (
          <button className="btn btn-primary" onClick={() => setMode("create")}>
            Novi stan
          </button>
        ) : null}
      </div>

      {mode === "list" ? (
        <DataTable columns={columns} rows={rows} actions={actions} />
      ) : mode === "create" ? (
        <EntityForm
          title="Novi stan"
          fields={fields}
          initialValues={{
            buildingId: "",
            number: "",
            floor: "",
            rooms: "",
            area: "",
            price: "",
            status: "available",
          }}
          onSubmit={create}
          onCancel={resetForm}
          submitLabel="Kreiraj"
        />
      ) : (
        <EntityForm
          title={`Izmena stana #${selected?.id}`}
          fields={fields}
          initialValues={{
            buildingId: selected?.buildingId ?? "",
            number: selected?.number ?? "",
            floor: selected?.floor ?? "",
            rooms: selected?.rooms ?? "",
            area: selected?.area ?? "",
            price: selected?.price ?? "",
            status: selected?.status ?? "",
          }}
          onSubmit={update}
          onCancel={resetForm}
          submitLabel="Sačuvaj"
        />
      )}
    </div>
  );
}
