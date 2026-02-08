import { useEffect, useMemo, useState } from "react";
import { api } from "../../api/apiClient";
import { getRole } from "../../auth/authService";
import DataTable from "../../components/DataTable";
import EntityForm from "../../components/EntityForm";

export default function ApartmentsAppPage() {
  const role = getRole();

  const isAdmin = role === "admin";
  const isOwner = role === "owner";

  const baseListEndpoint = isAdmin
    ? "/admin/apartments"
    : isOwner
    ? "/owner/apartments"
    : null;

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [mode, setMode] = useState("list"); // list | create | edit
  const [selected, setSelected] = useState(null);

  function resetForm() {
    setSelected(null);
    setMode("list");
  }

  async function load() {
    if (!baseListEndpoint) {
      setError("Nedozvoljen pristup.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const data = await api.get(baseListEndpoint);
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || "Greška pri učitavanju stanova");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseListEndpoint]);

  // kolone - prikazujemo minimalno, a render tolerantno (ako polje ne postoji)
  const columns = useMemo(
    () => [
      { key: "id", header: "ID" },
      { key: "number", header: "Broj" },
      { key: "rooms", header: "Sobe" },
      { key: "floor", header: "Sprat" },
      { key: "price", header: "Cena" },
      { key: "status", header: "Status" },
      { key: "buildingId", header: "ZgradaID" },
    ],
    []
  );

  const fieldsAdmin = useMemo(
    () => [
      { name: "buildingId", label: "ZgradaID", type: "number", required: true },
      { name: "number", label: "Broj", type: "text", required: true },
      { name: "rooms", label: "Sobe", type: "number", required: true },
      { name: "floor", label: "Sprat", type: "number" },
      { name: "price", label: "Cena", type: "number" },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: [
          { value: "available", label: "available" },
          { value: "reserved", label: "reserved" },
          { value: "sold", label: "sold" },
        ],
      },
      { name: "ownerId", label: "OwnerID", type: "number" },
    ],
    []
  );

  const fieldsOwner = useMemo(
    () => [
      { name: "number", label: "Broj", type: "text" },
      { name: "price", label: "Cena", type: "number" },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: [
          { value: "available", label: "available" },
          { value: "reserved", label: "reserved" },
          { value: "sold", label: "sold" },
        ],
      },
    ],
    []
  );

  const actions = useMemo(() => {
    const list = [];

    // edit za admin i owner
    list.push({
      label: "Izmeni",
      onClick: (r) => {
        setSelected(r);
        setMode("edit");
      },
    });

    // delete samo admin
    if (isAdmin) {
      list.push({
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

    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  async function create(values) {
    // admin create
    await api.post("/admin/apartments", values);
    await load();
    resetForm();
  }

  async function update(values) {
    if (!selected?.id) throw new Error("Nije izabran stan.");

    if (isAdmin) {
      await api.put(`/admin/apartments/${selected.id}`, values);
    } else if (isOwner) {
      await api.put(`/owner/apartments/${selected.id}`, values);
    } else {
      throw new Error("Nedozvoljeno.");
    }

    await load();
    resetForm();
  }

  if (loading) return <div>Učitavanje...</div>;
  if (error) return <div style={{ color: "crimson" }}>{error}</div>;

  return (
    <div>
      <h2>Stanovi</h2>

      {mode === "list" ? (
        <>
          {isAdmin ? (
            <button onClick={() => setMode("create")} style={{ marginBottom: 12 }}>
              Novi stan
            </button>
          ) : null}

          <DataTable columns={columns} rows={rows} actions={actions} />
        </>
      ) : mode === "create" ? (
        <EntityForm
          title="Novi stan"
          fields={fieldsAdmin}
          initialValues={{
            buildingId: "",
            number: "",
            rooms: "",
            floor: "",
            price: "",
            status: "",
            ownerId: "",
          }}
          onSubmit={create}
          onCancel={resetForm}
          submitLabel="Kreiraj"
        />
      ) : (
        <EntityForm
          title={`Izmena stana #${selected?.id}`}
          fields={isAdmin ? fieldsAdmin : fieldsOwner}
          initialValues={
            isAdmin
              ? {
                  buildingId: selected?.buildingId ?? "",
                  number: selected?.number ?? "",
                  rooms: selected?.rooms ?? "",
                  floor: selected?.floor ?? "",
                  price: selected?.price ?? "",
                  status: selected?.status ?? "",
                  ownerId: selected?.ownerId ?? "",
                }
              : {
                  number: selected?.number ?? "",
                  price: selected?.price ?? "",
                  status: selected?.status ?? "",
                }
          }
          onSubmit={update}
          onCancel={resetForm}
          submitLabel="Sačuvaj"
        />
      )}
    </div>
  );
}
