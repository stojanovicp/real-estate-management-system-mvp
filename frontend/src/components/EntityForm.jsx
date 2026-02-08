import { useMemo, useState } from "react";

/**
 * fields: [
 *  { name: "name", label: "Naziv", type: "text", required: true },
 *  { name: "rooms", label: "Sobe", type: "number" },
 *  { name: "status", label: "Status", type: "select", options: [...] }
 * ]
 */
export default function EntityForm({
  title,
  fields,
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Sačuvaj",
}) {
  const init = useMemo(() => initialValues || {}, [initialValues]);
  const [values, setValues] = useState(init);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function setField(name, value) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // minimalna validacija required
    for (const f of fields) {
      if (f.required) {
        const v = values[f.name];
        if (v === undefined || v === null || String(v).trim() === "") {
          setError(`Polje "${f.label}" je obavezno.`);
          return;
        }
      }
    }

    setSaving(true);
    try {
      await onSubmit(values);
    } catch (err) {
      setError(err?.message || "Greška pri čuvanju");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
      {title ? <h3 style={{ marginTop: 0 }}>{title}</h3> : null}

      {error ? (
        <div style={{ color: "crimson", marginBottom: 10 }}>{error}</div>
      ) : null}

      <form onSubmit={handleSubmit}>
        {fields.map((f) => (
          <div key={f.name} style={{ marginBottom: 10 }}>
            <label style={{ display: "block", marginBottom: 4 }}>
              {f.label}
            </label>

            {f.type === "select" ? (
              <select
                value={values[f.name] ?? ""}
                onChange={(e) => setField(f.name, e.target.value)}
                style={{ width: "100%" }}
              >
                <option value="">--</option>
                {(f.options || []).map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : f.type === "textarea" ? (
              <textarea
                rows={4}
                value={values[f.name] ?? ""}
                onChange={(e) => setField(f.name, e.target.value)}
                style={{ width: "100%" }}
              />
            ) : (
              <input
                type={f.type || "text"}
                value={values[f.name] ?? ""}
                onChange={(e) => setField(f.name, e.target.value)}
                style={{ width: "100%" }}
              />
            )}
          </div>
        ))}

        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" disabled={saving}>
            {saving ? "Čuvanje..." : submitLabel}
          </button>

          {onCancel ? (
            <button type="button" onClick={onCancel}>
              Otkaži
            </button>
          ) : null}
        </div>
      </form>
    </div>
  );
}
