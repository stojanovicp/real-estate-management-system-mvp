export default function DataTable({ columns, rows, actions }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {columns.map((c) => (
            <th
              key={c.key}
              style={{
                textAlign: "left",
                borderBottom: "1px solid #ddd",
                padding: 8,
              }}
            >
              {c.header}
            </th>
          ))}
          {actions && actions.length > 0 ? (
            <th
              style={{
                textAlign: "left",
                borderBottom: "1px solid #ddd",
                padding: 8,
                width: 1,
                whiteSpace: "nowrap",
              }}
            >
              Akcije
            </th>
          ) : null}
        </tr>
      </thead>

      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td
              colSpan={columns.length + (actions?.length ? 1 : 0)}
              style={{ padding: 12 }}
            >
              Nema podataka.
            </td>
          </tr>
        ) : (
          rows.map((r) => (
            <tr key={r.id ?? JSON.stringify(r)}>
              {columns.map((c) => (
                <td
                  key={c.key}
                  style={{ borderBottom: "1px solid #f0f0f0", padding: 8 }}
                >
                  {c.render ? c.render(r) : String(r[c.key] ?? "")}
                </td>
              ))}
              {actions && actions.length > 0 ? (
                <td
                  style={{
                    borderBottom: "1px solid #f0f0f0",
                    padding: 8,
                    whiteSpace: "nowrap",
                  }}
                >
                  {actions.map((a) => (
                    <button
                      key={a.label}
                      onClick={() => a.onClick(r)}
                      style={{ marginRight: 8 }}
                      type="button"
                    >
                      {a.label}
                    </button>
                  ))}
                </td>
              ) : null}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
